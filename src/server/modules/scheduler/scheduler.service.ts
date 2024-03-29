import { Component, Inject } from '@nestjs/common';
import { Constants, ProviderTokens } from '../../constants';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as _ from 'underscore';
import { MinutesOfDay } from '../../helpers/moment-helpers';
import { StudentService } from '@server/modules/students/student.service';
import { BlockService } from '@server/modules/blocks/block.service';
import { ReservationDocument } from '@server/modules/reservations/reservation.schema';
import { IClassBlock, ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { BlockDocument } from '@server/modules/blocks/block.schema';
import { IStudent } from '@shared/interfaces/models/IStudent';
import { IReservation } from '@shared/interfaces/models/IReservation';
import { IBlock } from '@shared/interfaces/models/IBlock';

const RESTRICT_STUDENT_DAY = true;

@Component()
export class SchedulerService {
  constructor(private readonly studentService: StudentService,
              private readonly blockService: BlockService,
              @Inject(ProviderTokens.Reservation) private readonly reservationModel: Model<ReservationDocument>) {
  }

  // region Eligible Missed Classes

  /**
   * Retrieves a list of past classes that are still eligible for being made up for the provided student. If
   * includeFuture is true, then the list will include future classes that can have makeup classes scheduled
   * in advance.
   * @param {string} studentNumber - The student number of the student to look up
   * @param {boolean} includeFuture - Flag to retrieve future classes that can be scheduled for makeup
   */
  async getEligibleMissedClasses(studentNumber: string, includeFuture: boolean): Promise<ISchoolDay[]> {
    const student = await this.studentService.findByStudentNumber(studentNumber);

    if (!student) {
      return [];
    }

    let blocks: BlockDocument[] = [];

    if (student.block) {
      blocks.push(<BlockDocument>student.block);
    } else {
      blocks = await this.blockService.getBlocksForGrades([student.grade]);
    }

    if (blocks.length === 0) {
      return [];
    }

    return this._buildEligibleMissedClasses(student, blocks, includeFuture);
  }

  /**
   * Builds a list of past classes that are still eligible for being made up for the provided student. If
   * includeFuture is true, then the list will include future classes that can have makeup classes scheduled
   * in advance.
   * @param {IStudent} student - The student trying to schedule the makeup
   * @param {BlockDocument[]} blocks - The blocks this student could have missed
   * @param {boolean} includeFuture - True to include future classes that can have makeup classes scheduled in advance
   * @returns {ISchoolDay[]}
   * @private
   */
  private _buildEligibleMissedClasses(student: IStudent, blocks: BlockDocument[], includeFuture: boolean): ISchoolDay[] {
    const eligibleDays: ISchoolDay[] = [];
    const mToday = moment();

    // The maximum number of days to display
    const maxDays = (includeFuture) ? 14 : 7;
    let count = 0;

    // Minimum eligible day is 1 week in the past so start the loop there
    const mCurrentDay = moment(mToday).subtract(1, 'week');

    while (count <= maxDays) {
      const dayOfWeek = mCurrentDay.isoWeekday();
      const blockDtos: IClassBlock[] = [];

      if (student.blockDayOfWeek && dayOfWeek !== student.blockDayOfWeek) {
        mCurrentDay.add(1, 'day');
        count++;
        continue;
      }

      for (const block of blocks) {
        // Is this block scheduled for the loops current day of the week?
        if (_.contains(block.days, dayOfWeek)) {

          if (!this._canBlockBeMadeupOnDate(block, mCurrentDay)) {
            continue;
          }

          blockDtos.push({
            name: block.name,
            startTime: block.startTime,
            endTime: block.endTime,
            blockId: block._id,
          });
        }
      }

      if (blockDtos.length > 0) {
        eligibleDays.push({
          classDate: mCurrentDay.startOf('day').toDate(),
          blocks: blockDtos
        });
      }

      mCurrentDay.add(1, 'day');
      count++;
    }

    return eligibleDays;
  }

  /**
   * Checks if the block can have a makeup scheduled for the given date. This checks the block's available
   * makeup days and ensures that the first available makeup time has not already passed
   * @param {BlockDocument} block - The block to check
   * @param {moment.Moment} mDate - The date
   * @returns {boolean}
   * @private
   */
  private _canBlockBeMadeupOnDate(block: BlockDocument, mDate: moment.Moment): boolean {
    const mMinEligibleDay = moment();
    const mNextOccurrence = moment(mDate).add(1, 'week');

    // Calculate the blocks min eligible day
    // i.e. Ensure the first makeup is before the next normal occurrence
    const mBlockMinDay = moment(mMinEligibleDay);

    while (true) {
      if (mBlockMinDay.isSameOrAfter(mNextOccurrence, 'day')) {
        return false;
      }

      if (!_.contains(block.makeupDays, mBlockMinDay.isoWeekday())) {
        mBlockMinDay.add(1, 'day');
        continue;
      }

      if (mBlockMinDay.isSame(moment(), 'day')) {
        const mBlockStartTime = moment(block.startTime, Constants.BlockTimeFormat);

        if  (MinutesOfDay(mBlockStartTime) > MinutesOfDay(moment())) {
          return true;
        } else {
          mBlockMinDay.add(1, 'day');
          continue;
        }
      }

      return true;
    }
  }

  // endregion

  // region Eligible Makeup Classes

  /**
   * Retrieves a list of potential makeup classes that the student can reserve based on the provided date and block
   * they missed.
   * @param {string} missedDate - The date of the missed class
   * @param {string} blockId - The blockId of the missed class
   */
  async getEligibleMakeupClasses(missedDate: string, blockId: string): Promise<ISchoolDay[]> {
    const mMissedDate = moment(missedDate, 'MM-DD-YYYY');
    const block = await this.blockService.getBlock(blockId);

    if (!block) {
      return [];
    }

    return await this._buildEligibleMakeupClasses(mMissedDate, block);
  }

  private async _buildEligibleMakeupClasses(mMissedDate: moment.Moment, missedBlock: BlockDocument): Promise<ISchoolDay[]> {
    const mToday = moment();
    const eligibleDays: ISchoolDay[] = [];
    const mCurrentDate = moment(mToday).startOf('day');

    const maxEligibleDate = moment(mMissedDate).add(1, 'week').subtract(1, 'day');
    const blockStartMinutes = MinutesOfDay(moment(missedBlock.startTime, Constants.BlockTimeFormat));
    const currentMinutes = MinutesOfDay(mToday);

    while (mCurrentDate.isSameOrBefore(maxEligibleDate)) {
      const dayOfWeek = mCurrentDate.isoWeekday();

      if (!_.contains(missedBlock.makeupDays, dayOfWeek) || mCurrentDate.isSame(mMissedDate, 'day')) {
        mCurrentDate.add(1, 'day');
        continue;
      }

      if (mCurrentDate.isSame(mToday, 'day') && currentMinutes > blockStartMinutes) {
        mCurrentDate.add(1, 'day');
        continue;
      }

      const openSpots = missedBlock.maxStudents - (await missedBlock.ReservationCount(mCurrentDate.toDate()));

      eligibleDays.push({
        classDate: mCurrentDate.toDate(),
        blocks: [
          {
            name: missedBlock.name,
            blockId: missedBlock._id,
            startTime: missedBlock.startTime,
            endTime: missedBlock.endTime,
            openSpots: openSpots
          }
        ]
      });

      mCurrentDate.add(1, 'day');
    }

    return eligibleDays;
  }

  // endregion

  // region Reservations

  /**
   * Attempts to reserve the provided makeup class for the current student.
   * @param {string} studentNumber - The unique number of the student making a reservation
   * @param {string} makeupDate - The date of the makeup class
   * @param {string} missedDate - The date of the missed class
   * @param {string} blockId - The blockId of the makeup class
   */
  async reserveMakeupClass(studentNumber: string, missedDate: string, makeupDate: string, blockId: string, validateDate: boolean): Promise<boolean> {

    const block = await this.blockService.getBlock(blockId);

    if (block == null) {
      return false;
    }

    const student = await this.studentService.findByStudentNumber(studentNumber);

    if (student == null) {
      return false;
    }

    const mMissedDate = moment(missedDate, 'MM/DD/YYYY');
    const mMakeupDate = moment(makeupDate, 'MM/DD/YYYY');

    if (!await this.validateReservation(student, mMissedDate, mMakeupDate, block, validateDate)) {
      return false;
    }

    const newRes: IReservation = {
      block,
      student,
      makeupDate: mMakeupDate.toDate(),
      missedDate: mMissedDate.toDate(),
      createdDate: new Date(),
      checkedIn: false
    };

    await this.reservationModel.create(newRes);

    return true;
  }

  /**
   * Validates that the provided student is eligible to make a reservation for
   * @param {IStudent} student
   * @param {moment.Moment} missedDate
   * @param {moment.Moment} makeupDate
   * @param {IBlock} block
   * @param {boolean} validateDate
   * @returns {Promise<boolean>}
   */
  async validateReservation(
    student: IStudent,
    missedDate: moment.Moment,
    makeupDate: moment.Moment,
    block: BlockDocument,
    validateDate: boolean): Promise<boolean> {

    if (!_.contains(block.grades, student.grade)) {
      return false;
    }

    if (validateDate && !_.contains(block.makeupDays, makeupDate.isoWeekday())) {
      return false;
    }

    if (await block.ReservationCount(makeupDate.toDate()) >= block.maxStudents) {
      return false;
    }

    if (validateDate && moment(missedDate).add(1, 'week').isSameOrBefore(makeupDate)) {
      return false;
    }

    return true;
  }

  async getReservations(makeupDate: string): Promise<IReservation[]> {

    const mMakeupDate = moment(makeupDate, 'MM/DD/YYYY');

    const resDocuments = await this.reservationModel
      .find({makeupDate: mMakeupDate.toDate()})
      .populate({
        path: 'student',
        populate: {path: 'block'}
      })
      .populate('block')
      .exec();

    return resDocuments.map((doc: ReservationDocument): IReservation => {
      return {
        id: doc._id,
        block: <IBlock>doc.block,
        student: <IStudent>doc.student,
        missedDate: doc.missedDate,
        makeupDate: doc.makeupDate,
        createdDate: doc.createdDate,
        checkedIn: doc.checkedIn
      };
    });

  }

  async getStudentReservations(studentId: string): Promise<IReservation[]> {
    return await this.reservationModel
      .find({'student': studentId})
      .populate('block')
      .exec();
  }

  /**
   *
   * @param {string} resId
   * @param {boolean} status
   * @returns {Promise<boolean>}
   */
  async updateReservationStatus(resId: string, status: boolean): Promise<boolean> {
    const newRes = await this.reservationModel.findOneAndUpdate({_id: resId}, {checkedIn: status}, {new: true}).exec();

    return newRes && newRes.checkedIn === status;
  }

  async deleteReservation(resId: string): Promise<any> {
    return await this.reservationModel.deleteOne({_id: resId}).exec();
  }

  // endregion
}

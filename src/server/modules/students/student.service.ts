import { Component, Inject } from '@nestjs/common';
import { ProviderTokens } from '@server/constants';
import { IStudent, StudentDocument } from './student.schema';
import { Model } from 'mongoose';
import {EmptyCsvStudent, ICsvStudent} from '@shared/interfaces/student/IStudentImportUpload';
import * as fs from 'fs';
import * as fast_csv from 'fast-csv';
import * as _ from 'underscore';
import {FailureException, FailureResult, IApiResult, SuccesResult} from '@shared/interfaces/api';
import {map, toArray} from 'rxjs/operators';
import {streamToRx} from '@server/helpers/fromReadableStream';
import * as moment from 'moment';
import {BlockService} from '@server/modules/blocks/block.service';
import {BlockDocument} from '@server/modules/blocks/block.schema';


@Component()
export class StudentService {
  constructor(
    @Inject(ProviderTokens.Student) private readonly studentModel: Model<StudentDocument>,
    private readonly blockService: BlockService
  ) { }

  async findByStudentNumber(studentNumber: string, includeBlock: boolean = true): Promise<IStudent> {
    if (includeBlock) {
      return await this.studentModel.findOne({studentNumber}).populate('block').exec();
    } else {
      return await this.studentModel.findOne({studentNumber}).exec();
    }
  }



  async importNewStudents(filePath: string): Promise<IApiResult> {
    if (!filePath || filePath.length === 0) {
      return new FailureResult('No input file!');
    }

    const blocks = await this.blockService.listBlocks();

    try {
      const stream = fs.createReadStream(filePath);
      const csvStream = fast_csv.fromStream(stream, { headers: true })
        .validate(this.validateCsvRow);

      streamToRx<ICsvStudent>(csvStream).pipe(
        map((data: ICsvStudent): IStudent => {
          const icSlug = data.courseSection.substr(3, 2);
          const blockDayOfWeek = moment(data.courseSection.substr(0, 3), 'ddd').isoWeekday();
          const grade = parseInt(data.grade, 10);

          const block = _.find(blocks, (b: BlockDocument) => {
            return b.icSlug === icSlug && _.contains(b.grades, grade);
          });

          return {
            studentNumber: data.studentNumber,
            lastName: data.lastName,
            firstName: data.firstName,
            grade: grade,
            birthDate: moment(data.birthdate, 'MM/DD/YYYY').toDate(),
            block: (block) ? block._id : null,
            blockDayOfWeek: blockDayOfWeek,
            blockRoom: data.room
          };
        }),
        toArray()
      ).subscribe(async (students: StudentDocument[]) => {
        await this.studentModel.insertMany(students);
      });
    } catch (e) {
      return new FailureException(e);
    }

    return new SuccesResult();
  }

  private validateCsvRow(student: ICsvStudent): boolean {
    for (const key of Object.keys(EmptyCsvStudent)) {
      if (!student[key]) {
        return false;
      }
    }
    return true;
  }
}

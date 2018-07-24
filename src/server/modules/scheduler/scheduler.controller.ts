import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SchedulerService } from '@server/modules/scheduler/scheduler.service';
import { SchedulingApi } from '@shared/api-endpoints';
import { IAuthToken } from '@shared/interfaces/Auth';
import { FailureResult, IApiResult, SuccesResult } from '@shared/interfaces/api';
import { ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { Token } from '@server/decorators/token.decorator';
import * as _ from 'underscore';
import { ErrorMsg } from '@server/constants';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { Roles } from '@server/decorators/role.decorator';
import { AvailableRoles } from '@server/helpers/roles';
import { IReservation } from '@shared/interfaces/models/IReservation';


@Controller()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {
  }

  // region Student Scheduling Routes
  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.STUDENT)
  @Get(SchedulingApi.getRecentClasses)
  async getEligibleRecentClasses(@Token() token: IAuthToken,
                                 @Query('future') includeFuture: boolean): Promise<IApiResult<ISchoolDay[]>> {
    if (token === null) {
      return new FailureResult(ErrorMsg.MissingToken);
    }

    const classes = await this.schedulerService.getEligibleMissedClasses(token.studentNumber, includeFuture);

    return new SuccesResult<ISchoolDay[]>(classes);
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Get(SchedulingApi.getRecentClassesAdmin)
  async getEligibleRecentClassesForStudent(@Query('future') includeFuture: boolean,
                                           @Query('studentNumber') studentNumber: string): Promise<IApiResult<ISchoolDay[]>> {
    const classes = await this.schedulerService.getEligibleMissedClasses(studentNumber, includeFuture);

    return new SuccesResult<ISchoolDay[]>(classes);
  }


  @Get(SchedulingApi.getAvailableClasses)
  async getEligibleMakeupClasses(@Token() token: IAuthToken,
                                 @Query('date') missedDate: string,
                                 @Query('blockId') blockId: string): Promise<IApiResult<ISchoolDay[]>> {

    if (token === null) {
      return new FailureResult(ErrorMsg.MissingToken);
    }

    if (_.isEmpty(missedDate)) {
      return new FailureResult(ErrorMsg.MissingDate);
    }

    if (_.isEmpty(blockId)) {
      return new FailureResult(ErrorMsg.MissingBlock);
    }

    const classes = await this.schedulerService.getEligibleMakeupClasses(missedDate, blockId);

    return new SuccesResult<ISchoolDay[]>(classes);
  }

  @Post(SchedulingApi.postReservation)
  async reserveMakeupClass(@Token() token: IAuthToken,
                           @Body('missedDate') missedDate: string,
                           @Body('makeupDate') makeupDate: string,
                           @Body('blockId') blockId: string): Promise<IApiResult> {
    if (token === null) {
      return new FailureResult(ErrorMsg.MissingToken);
    }

    if (_.isEmpty(makeupDate) || _.isEmpty(missedDate)) {
      return new FailureResult(ErrorMsg.MissingDate);
    }

    if (_.isEmpty(blockId)) {
      return new FailureResult(ErrorMsg.MissingBlock);
    }

    const result = await this.schedulerService.reserveMakeupClass(token.studentNumber, missedDate, makeupDate, blockId, true);

    return result ? new SuccesResult() : new FailureResult('There was a problem reserving that class!');
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Post(SchedulingApi.postReservationAdmin)
  async reserveMakeupClassAdmin(@Body('missedDate') missedDate: string,
                                @Body('makeupDate') makeupDate: string,
                                @Body('studentNumber') studentNumber: string,
                                @Body('blockId') blockId: string,
                                @Body('dateRestriction') dateRestriction: boolean): Promise<IApiResult> {
    if (_.isEmpty(studentNumber)) {
      return new FailureResult('Missing student number!');
    }

    if (_.isEmpty(makeupDate) || _.isEmpty(missedDate)) {
      return new FailureResult(ErrorMsg.MissingDate);
    }

    if (_.isEmpty(blockId)) {
      return new FailureResult(ErrorMsg.MissingBlock);
    }

    const result = await this.schedulerService.reserveMakeupClass(studentNumber, missedDate, makeupDate, blockId, dateRestriction);

    return result ? new SuccesResult() : new FailureResult('There was a problem reserving that class!');
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Post(SchedulingApi.postDeleteReservation)
  async deleteReservation(@Body('resId') resId: string): Promise<IApiResult> {
    await this.schedulerService.deleteReservation(resId);
    return new SuccesResult();
  }

  // endregion

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Get(SchedulingApi.getReservations)
  async getReservations(@Query('date') makeupDate: string): Promise<IApiResult<IReservation[]>> {
    const result = await this.schedulerService.getReservations(makeupDate);

    return new SuccesResult(result);
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Get(SchedulingApi.updateReservationStatus)
  async updateReservation(@Body('id') resId: string, @Body('status') newStatus: boolean): Promise<IApiResult> {
    const result = await this.schedulerService.updateReservationStatus(resId, newStatus);

    return result ? new SuccesResult() : new FailureResult('Failed to update status!');
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Get(SchedulingApi.getStudentReservations)
  async getStudentReservations(@Query('id') studentId: string): Promise<IApiResult<IReservation[]>> {
    const result = await this.schedulerService.getStudentReservations(studentId);

    return new SuccesResult(result);
  }

}

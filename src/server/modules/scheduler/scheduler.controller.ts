import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SchedulerService } from '@server/modules/scheduler/scheduler.service';
import { SchedulingApi } from '@shared/api-endpoints';
import { IAuthToken } from '@shared/interfaces/Auth';
import { FailureResult, IApiResult, SuccesResult } from '@shared/interfaces/api';
import { ISchoolDayDto } from '@shared/interfaces/scheduler/ISchoolDay';
import { Token } from '@server/decorators/token.decorator';
import * as _ from 'underscore';
import { ErrorMsg } from '@server/constants';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { Roles } from '@server/decorators/role.decorator';
import { AvailableRoles } from '@server/helpers/roles';


@Controller()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.STUDENT)
  @Get(SchedulingApi.getRecentClasses)
  async getEligibleRecentClasses(
    @Token() token: IAuthToken,
    @Query('future') includeFuture: boolean): Promise<IApiResult<ISchoolDayDto[]>> {
    if (token === null) {
      return new FailureResult(ErrorMsg.MissingToken);
    }

    const classes = await this.schedulerService.getEligibleMissedClasses(token.studentNumber, includeFuture);

    return new SuccesResult<ISchoolDayDto[]>(classes);
  }


  @Get(SchedulingApi.getAvailableClasses)
  async getEligibleMakeupClasses(
    @Token() token: IAuthToken,
    @Query('date') missedDate: string,
    @Query('blockId') blockId: string): Promise<IApiResult<ISchoolDayDto[]>> {

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

    return new SuccesResult<ISchoolDayDto[]>(classes);
  }

  @Post(SchedulingApi.postReservation)
  async reserveMakeupClass(
    @Token() token: IAuthToken,
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

    const result = await this.schedulerService.reserveMakeupClass(token.studentNumber, missedDate, makeupDate, blockId);

    return result ? new SuccesResult() : new FailureResult('There was a problem reserving that class!');
  }

}

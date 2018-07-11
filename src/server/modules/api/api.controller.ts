import { Controller, Get } from '@nestjs/common';
import { IApiResult, SuccesResult } from '@shared/interfaces/api';
import { ISchoolDayDto } from '@shared/interfaces/scheduler/ISchoolDay';

@Controller('api')
export class ApiController {

  @Get('hello')
  root(): IApiResult {

    return new SuccesResult();
  }
}

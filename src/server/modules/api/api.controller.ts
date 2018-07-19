import { Controller, Get } from '@nestjs/common';
import { IApiResult, SuccesResult } from '@shared/interfaces/api';
import { ISchoolDay } from '@shared/interfaces/models/ISchoolDay';

@Controller('api')
export class ApiController {

  @Get('hello')
  root(): IApiResult {

    return new SuccesResult();
  }
}

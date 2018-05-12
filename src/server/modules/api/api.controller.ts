import { Controller, Get } from '@nestjs/common';
import { IApiResult, SuccesResult } from '@shared/interfaces/api';
import { ISchoolDayDto } from '@shared/interfaces/scheduler/ISchoolDay';

@Controller('api')
export class ApiController {

  @Get('hello')
  root(): IApiResult<ISchoolDayDto[]> {

    return new SuccesResult<ISchoolDayDto[]>([
      {
        classDate: new Date(),
        blocks: [{
          blockId: 'abc123',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          name: 'Morning'
        }]
      }
    ]);
  }
}

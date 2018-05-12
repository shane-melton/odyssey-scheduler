import { Controller, Get, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { Token } from '../../decorators/token.decorator';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { IAuthToken } from '@shared/interfaces/Auth';
import { FailureResult, IApiResult, SuccesResult } from '@shared/interfaces/api';
import { IStudent } from '@server/modules/students/student.schema';
import { Roles } from '@server/decorators/role.decorator';
import { AvailableRoles } from '@server/helpers/roles';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.STUDENT)
  @Get('me')
  async getMe(@Token() token: IAuthToken): Promise<IApiResult<IStudent>> {
    const student = await this.studentService.findByStudentNumber(token.studentNumber);
    if (student !== null) {
      return new SuccesResult(student);
    } else {
      return new FailureResult('Not found!');
    }
  }
}

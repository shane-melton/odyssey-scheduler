import { Controller, Get, UseGuards, UploadedFile, UseInterceptors, FileInterceptor, Post, Query, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { Token } from '../../decorators/token.decorator';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { IAuthToken } from '@shared/interfaces/Auth';
import { FailureException, FailureResult, IApiResult, SuccesResult } from '@shared/interfaces/api';
import { Roles } from '@server/decorators/role.decorator';
import { AvailableRoles } from '@server/helpers/roles';
import { diskStorage } from 'multer';
import { extname} from 'path';
import {StudentApi} from '@shared/api-endpoints';
import { IStudent } from '@shared/interfaces/models/IStudent';


@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.STUDENT)
  @Get(StudentApi.getMe)
  async getMe(@Token() token: IAuthToken): Promise<IApiResult<IStudent>> {
    const student = await this.studentService.findByStudentNumber(token.studentNumber, false);
    if (student !== null) {
      return new SuccesResult(student);
    } else {
      return new FailureResult('Not found!');
    }
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @UseInterceptors(FileInterceptor('file_upload', {
    fileFilter: (req, file, cb) => {
      if (extname(file.originalname) !== '.csv') {
        return cb(null, false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: './uploads'
      , filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  @Post(StudentApi.postImport)
  async newImport(@UploadedFile() file_upload: Express.Multer.File): Promise<IApiResult> {
    if (!file_upload) {
      return new FailureResult('File not found!');
    }

    return await this.studentService.importNewStudents(file_upload.path);
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @UseInterceptors(FileInterceptor('file_upload', {
    fileFilter: (req, file, cb) => {
      if (extname(file.originalname) !== '.csv') {
        return cb(null, false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: './uploads'
      , filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  @Post(StudentApi.postImportUpdate)
  async studentImportUpdate(@UploadedFile() file_upload: Express.Multer.File): Promise<IApiResult> {
    if (!file_upload) {
      return new FailureResult('File not found!');
    }

    return await this.studentService.importUpdateStudents(file_upload.path);
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Get(StudentApi.getStudent)
  async getStudent(@Query('studentNumber') studentNumber: string): Promise<IApiResult<IStudent>> {
    const student = await this.studentService.findByStudentNumber(studentNumber, true);

    if (student !== null) {
      return new SuccesResult(student);
    } else {
      return new FailureResult('Not found!');
    }
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Post(StudentApi.postUpdate)
  async updateStudent(@Body() student: IStudent): Promise<IApiResult> {
    try {
      const result = await this.studentService.updateStudent(student);

      if (result) {
        return new SuccesResult();
      } else {
        return new FailureResult('Failed to update student!');
      }

    } catch (exception) {
      if (exception.name === 'ValidationError') {
        return new FailureException(exception, 'Invalid student!');
      }
      return new FailureException(exception);
    }
  }


}

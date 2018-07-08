import {Controller, Get, UseGuards, UploadedFile, UseInterceptors, FileInterceptor, Post} from '@nestjs/common';
import { StudentService } from './student.service';
import { Token } from '../../decorators/token.decorator';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { IAuthToken } from '@shared/interfaces/Auth';
import { FailureResult, IApiResult, SuccesResult } from '@shared/interfaces/api';
import { IStudent } from '@server/modules/students/student.schema';
import { Roles } from '@server/decorators/role.decorator';
import { AvailableRoles } from '@server/helpers/roles';
import {diskStorage} from 'multer';
import {basename, extname} from 'path';
import {IStudentUploadResult} from '@shared/interfaces/student/IStudentImportUpload';
import {StudentApi} from '@shared/api-endpoints';


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
  async studentUpdate(@UploadedFile() file_upload: Express.Multer.File): Promise<IApiResult> {
    if (!file_upload) {
      return new FailureResult('File not found!');
    }

    return await this.studentService.importUpdateStudents(file_upload.path);
  }


}

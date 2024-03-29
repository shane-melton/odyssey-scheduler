import { Module } from '@nestjs/common';
import { StudentController } from '@server/modules/students/student.controller';
import { StudentService } from '@server/modules/students/student.service';
import { studentProviders } from '@server/modules/students/student.schema';
import {BlocksModule} from '@server/modules/blocks/blocks.module';

@Module({
  imports: [BlocksModule],
  controllers: [StudentController],
  components: [
    StudentService,
    ...studentProviders],
  exports: [
    StudentService,
    ...studentProviders
  ]
})
export class StudentModule {

}

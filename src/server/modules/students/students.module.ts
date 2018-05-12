import { Module } from '@nestjs/common';
import { StudentController } from '@server/modules/students/student.controller';
import { StudentService } from '@server/modules/students/student.service';
import { studentProviders } from '@server/modules/students/student.schema';

@Module({
  imports: [],
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

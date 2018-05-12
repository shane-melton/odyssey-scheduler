import { Component, Inject } from '@nestjs/common';
import { ProviderTokens } from '@server/constants';
import { IStudent, StudentDocument } from './student.schema';
import { Model } from 'mongoose';

@Component()
export class StudentService {
  constructor(
    @Inject(ProviderTokens.Student) private readonly studentModel: Model<StudentDocument>
  ) { }

  async findByStudentNumber(studentNumber: string): Promise<IStudent> {
    return await this.studentModel.findOne({studentNumber}).exec();
  }
}

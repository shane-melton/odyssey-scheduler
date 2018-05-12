import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { ProviderTokens } from '../../constants';

export interface IStudent {
  readonly studentNumber: string;
  readonly name: string;
  readonly grade: number;
}

export interface StudentDocument extends IStudent, mongoose.Document { }

export const StudentSchema = new mongoose.Schema({
  studentNumber: String,
  name: String,
  grade: Number,
});

export const studentProviders = [
  {
    provide: ProviderTokens.Student,
    useFactory: (connection: Connection) => connection.model(ProviderTokens.Student, StudentSchema),
    inject: [ProviderTokens.Database],
  },
];

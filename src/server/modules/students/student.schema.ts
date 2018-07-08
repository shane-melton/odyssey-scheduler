import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { ProviderTokens } from '../../constants';
import {IBlock} from '@server/modules/blocks/block.schema';

export interface IStudent {
  readonly studentNumber: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly grade: number;
  readonly birthDate: Date;

  readonly block?: IBlock | string;
  readonly blockDayOfWeek?: number;
  readonly blockRoom: string;
}

export interface StudentDocument extends IStudent, mongoose.Document { }

export const StudentSchema = new mongoose.Schema({
  studentNumber: {
    type: String, required: true
  },
  firstName: {
    type: String, required: true
  },
  lastName: {
    type: String, required: true
  },
  grade: {
    type: Number, required: true
  },
  birthDate: {
    type: Date, required: true
  },
  block: {
    type: mongoose.Schema.Types.ObjectId, ref: ProviderTokens.Block
  },
  blockDayOfWeek: {
    type: Number, required: false
  },
  blockRoom: {
    type: String, required: false
  }
});

export const studentProviders = [
  {
    provide: ProviderTokens.Student,
    useFactory: (connection: Connection) => connection.model(ProviderTokens.Student, StudentSchema),
    inject: [ProviderTokens.Database],
  },
];

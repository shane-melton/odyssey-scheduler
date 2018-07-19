import { Connection, Schema, Document } from 'mongoose';
import { ProviderTokens } from '../../constants';
import { BaseSchema } from '@server/helpers/BaseSchema';
import { IStudent } from '@shared/interfaces/models/IStudent';

export interface StudentDocument extends IStudent, Document { }

export const StudentSchema = new BaseSchema({
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
    type: Schema.Types.ObjectId, ref: ProviderTokens.Block
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

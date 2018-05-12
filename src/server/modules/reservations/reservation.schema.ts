import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { ProviderTokens } from '../../constants';
import { IStudent } from '@server/modules/students/student.schema';
import { IBlock } from '@server/modules/blocks/block.schema';

export interface IReservation {
  readonly student: IStudent | string;
  readonly block: IBlock | string;
  readonly classDate: Date;
  readonly createdDate: Date;
}

export interface ReservationDocument extends IReservation, mongoose.Document { }

export const ReservationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId, ref: ProviderTokens.Student
  },
  block: {
    type: mongoose.Schema.Types.ObjectId, ref: ProviderTokens.Block
  },
  classDate: Date,
  createdDate: Date
});

export const reservationProviders = [
  {
    provide: ProviderTokens.Reservation,
    useFactory: (connection: Connection) => connection.model(ProviderTokens.Reservation, ReservationSchema),
    inject: [ProviderTokens.Database],
  },
];

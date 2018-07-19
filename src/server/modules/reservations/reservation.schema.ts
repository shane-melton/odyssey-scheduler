import { Connection, Schema, Document } from 'mongoose';
import { ProviderTokens } from '../../constants';
import { BaseSchema } from '@server/helpers/BaseSchema';
import { IReservation } from '@shared/interfaces/models/IReservation';

export interface ReservationDocument extends IReservation, Document { }

export const ReservationSchema = new BaseSchema({
  student: {
    type: Schema.Types.ObjectId, ref: ProviderTokens.Student
  },
  block: {
    type: Schema.Types.ObjectId, ref: ProviderTokens.Block
  },
  makeupDate: Date,
  missedDate: Date,
  createdDate: Date,
  checkedIn: Boolean
});

export const reservationProviders = [
  {
    provide: ProviderTokens.Reservation,
    useFactory: (connection: Connection) => connection.model(ProviderTokens.Reservation, ReservationSchema),
    inject: [ProviderTokens.Database],
  },
];

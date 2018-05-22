import { Document, Connection, Schema } from 'mongoose';
import { ProviderTokens } from '@server/constants';
import * as moment from 'moment';

export interface IBlock {
  readonly name: string;
  readonly days: number[];
  readonly makeupDays: number[];
  readonly grades: number[];
  readonly startTime: Date;
  readonly endTime: Date;
  readonly maxStudents: number;
  readonly rooms: string[];
}

export interface BlockDocument extends IBlock, Document {
  /**
   * Counts the number of reservations for this block and provided class date
   * @param {Date} classDate
   * @returns {Promise<number>}
   */
  ReservationCount(classDate: Date): Promise<number>;
}

export const BlockSchema = new Schema({
  name: {
    type: String, required: true
  },
  days: {
    type: [Number], required: true
  },
  makeupDays: {
    type: [Number], required: true
  },
  grades: {
    type: [Number], required: true
  },
  startTime: {
    type: Date, required: true
  },
  endTime: {
    type: Date, required: true
  },
  maxStudents: {
    type: Number, required: true, min: 0
  },
  rooms: {
    type: [String], required: true
  }
});


BlockSchema.methods.ReservationCount = async function (classDate: Date): Promise<number> {
  const mDate = moment(classDate).startOf('day');
  const reservationModel = this.model(ProviderTokens.Reservation);

  return await reservationModel.count({block: this._id, classDate: mDate.toDate()}).exec();
};

export const blockProviders = [
  {
    provide: ProviderTokens.Block,
    useFactory: (connection: Connection) => connection.model(ProviderTokens.Block, BlockSchema),
    inject: [ProviderTokens.Database],
  },
];

import { IStudent } from '@shared/interfaces/models/IStudent';
import { IBlock } from '@shared/interfaces/models/IBlock';

export interface IReservation {
  id?: any;
  student: IStudent | string;
  block: IBlock | string;
  makeupDate: Date;
  missedDate: Date;
  createdDate: Date;
  checkedIn: boolean;
}

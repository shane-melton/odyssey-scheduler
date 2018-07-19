import { IReservation } from '@shared/interfaces/models/IReservation';
import { IStudent } from '@shared/interfaces/models/IStudent';
import { IBlock } from '@shared/interfaces/models/IBlock';

export interface IReservationDto extends IReservation {
  student: IStudent;
  block: IBlock;
}

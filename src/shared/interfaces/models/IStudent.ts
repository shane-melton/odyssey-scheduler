import { IBlock } from '@shared/interfaces/models/IBlock';

export interface IStudent {
  id?: any;
  studentNumber: string;
  firstName: string;
  lastName: string;
  grade: number;
  birthDate: Date;

  block: IBlock | string;
  blockDayOfWeek: number;
  blockRoom: string;
}

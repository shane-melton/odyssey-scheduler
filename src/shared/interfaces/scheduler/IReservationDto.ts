import { IStudent } from '@server/modules/students/student.schema';
import { IBlock } from '@server/modules/blocks/block.schema';

export interface IReservationDto {
  readonly student: IStudent;
  readonly block: IBlock;
  readonly makeupDate: Date;
  readonly missedDate: Date;
  readonly createdDate: Date;
}

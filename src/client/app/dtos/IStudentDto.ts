import { IStudent } from '@shared/interfaces/models/IStudent';
import { IBlock } from '@shared/interfaces/models/IBlock';

export interface IStudentDto extends IStudent {
  block: IBlock;
}

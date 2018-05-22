import { BlockDocument } from '@server/modules/blocks/block.schema';
import * as moment from 'moment';

export interface ICreateBlockDto {
  name: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  grades: number[];
  rooms: string[];
  days: number[];
  makeupDays: number[];
}

export class IBlockDto {
  name: string;
  startTime: Date;
  endTime: Date;
  maxStudents: number;
  grades: number[];
  rooms: string[];
  days: number[];
  makeupDays: number[];

  static fromBlockDoc(doc: BlockDocument): IBlockDto {
    const newBlock = new IBlockDto();
    Object.assign(newBlock, doc);
    return newBlock;
  }

  timeRange() {
    return moment(this.startTime).format('h:mm a') + ' - ' + moment(this.endTime).format('h:mm a');
  }
}

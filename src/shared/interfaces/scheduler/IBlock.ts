import { BlockDocument } from '@server/modules/blocks/block.schema';
import * as moment from 'moment';

export interface IBlockDto {
  id?: string;
  name: string;
  icSlug: string;
  startTime: Date;
  endTime: Date;
  maxStudents: number;
  grades: number[];
  rooms: string[];
  days: number[];
  makeupDays: number[];
}

export class BlockDto implements IBlockDto {
  id?: string;
  name: string;
  icSlug: string;
  startTime: Date;
  endTime: Date;
  maxStudents: number;
  grades: number[];
  rooms: string[];
  days: number[];
  makeupDays: number[];

  static fromBlockDoc(doc: BlockDocument): BlockDto {
    const newBlock = new BlockDto();
    Object.assign(newBlock, doc);
    newBlock.id = doc._id;
    return newBlock;
  }

  timeRange() {
    return moment(this.startTime).format('h:mm a') + ' - ' + moment(this.endTime).format('h:mm a');
  }
}

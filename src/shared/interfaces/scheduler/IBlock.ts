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

  static fromIBlock(i: IBlockDto): BlockDto {
    const newBlock = new BlockDto();
    Object.assign(newBlock, i);
    return newBlock;
  }

  timeRange(short: boolean = false) {
    const format = short ? 'h:mm' : 'h:mm a';

    return moment(this.startTime).format(format) + ' - ' + moment(this.endTime).format(format);
  }
}

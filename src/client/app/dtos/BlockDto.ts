import * as moment from 'moment';
import { IBlock } from '@shared/interfaces/models/IBlock';

export class BlockDto implements IBlock {
  id: string;
  name: string;
  icSlug: string;
  days: number[];
  makeupDays: number[];
  grades: number[];
  startTime: Date;
  endTime: Date;
  maxStudents: number;
  rooms: string[];

  constructor(block: IBlock) {
    Object.assign(this, block);
  }

  timeRange(short: boolean = false) {
    const format = short ? 'h:mm' : 'h:mm a';

    return moment(this.startTime).format(format) + ' - ' + moment(this.endTime).format(format);
  }
}

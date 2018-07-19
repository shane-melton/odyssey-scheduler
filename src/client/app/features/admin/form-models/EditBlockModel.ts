import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import { FormControlModel, Ignore, Optional, Required } from '@client/features/admin/form-models/FormControlModel';
import { IMapTo } from '@client/interfaces/IMapTo';
import { IBlock } from '@shared/interfaces/models/IBlock';

export class EditBlockModel extends FormControlModel<IBlock> {
  @Optional()
  id?: string;

  /**
   * The name of the block
   */
  @Required()
  name;

  /**
   * The slug used for identifying which block a student form Infinite Campus belongs to.
   * Usually AM or PM.
   */
  @Required()
  icSlug: string;

  /**
   * The days of the week that the block is scheduled to occur.
   * Where 0 = Sunday and 6 = Saturday
   * @type {number[]}
   */
  @Required()
  days: number[] = [1, 2, 3, 4, 5];

  /**
   * The days of the week that the block is capable of having a makeup day scheduled.
   * Where 0 = Sunday and 6 = Saturday
   * @type {number[]}
   */
  @Required()
  makeupDays: number[] = [1, 2, 3, 4, 5];

  /**
   * The required grade levels for students in order for them to belong to this group
   */
  @Required()
  grades: number[];

  /**
   * The start time of the block
   * @type {string}
   */
  @Required()
  startTime = '7:30 AM';

  /**
   * The end time of the block
   * @type {string}
   */
  @Required()
  endTime = '11:30 AM';

  /**
   * The maximum number of students that can schedule a makeup for this block on any particular day
   * @type {number}
   */
  @Required(Validators.min(0))
  maxStudents = 0;

  /**
   * The rooms that this block is scheduled for
   */
  @Required()
  rooms: string[];

  constructor(formBuilder: FormBuilder, block?: IBlock) {
    super();

    if (!block) {
      this.buildForm(formBuilder);
      return;
    }

    Object.assign(this, block,
      {
        endTime: EditBlockModel.getInitTime(block.startTime),
        startTime: EditBlockModel.getInitTime(block.endTime)
      });

    this.buildForm(formBuilder);
  }

  /**
   * Converts the provided Date into the 'HH:mm A' format for editing
   * @param {Date} time
   * @returns {string}
   */
  private static getInitTime(time: Date): string {
    if (!time) {
      return '';
    }
    return moment(time).format('HH:mm A');
  }


  mapToModel(): IBlock {
    const formData = this._formGroup.value;

    return Object.assign({}, formData,
      {
        endTime: moment(formData.endTime, 'HH:mm A').toDate(),
        startTime: moment(formData.startTime, 'HH:mm A').toDate()
      });
  }
}

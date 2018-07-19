import { FormBuilder, Validators } from '@angular/forms';
import { FormControlModel, Ignore, Required } from '@client/features/admin/form-models/FormControlModel';
import { IMapTo } from '@client/interfaces/IMapTo';
import { IStudent } from '@shared/interfaces/models/IStudent';
import { getMongooseId } from '@shared/helpers/getMongooseId';
import * as moment from 'moment';

export class EditStudentModel extends FormControlModel<IStudent> {
  @Ignore()
  id?: string;

  @Required()
  studentNumber;

  @Required()
  firstName: string;

  @Required()
  lastName: string;

  @Required()
  grade: number;

  @Required(Validators.pattern('\\d{1,2}\\/\\d{1,2}\\/\\d{4}'))
  birthDate: string;

  @Required()
  blockId: string;

  @Required(Validators.min(0), Validators.max(6))
  blockDayOfWeek: number;

  @Required()
  blockRoom: string;


  constructor(formBuilder: FormBuilder, student?: IStudent) {
    super();

    if (!student) {
      this.buildForm(formBuilder);
      return;
    }

    Object.assign(this, student, {
      blockId: getMongooseId(student.block),
      birthDate: moment(student.birthDate).format('MM/DD/YYYY')
    });

    this.buildForm(formBuilder);
  }

  mapToModel(): IStudent {
    return Object.assign({}, this, {
      block: this.blockId,
      birthDate: moment(this.birthDate, 'MM/DD/YYYY').toDate()
    });
  }
}

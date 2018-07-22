import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { EditStudentModel } from '@client/features/admin/form-models/EditStudentModel';
import { Modal } from 'materialize-css';
import { IStudent } from '@shared/interfaces/models/IStudent';
import { FormBuilder } from '@angular/forms';
import * as _ from 'underscore';
import { SelectOption } from '@client/shared/material-select/material-select.component';
import { BlockDto } from '@client/dtos/BlockDto';
import { BlockService } from '@client/core/blocks/block.service';
import { StudentService } from '@client/core/student/student.service';
import { IApiResult } from '@shared/interfaces/api';
import { IStudentDto } from '@client/dtos/IStudentDto';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  styleUrls: ['./edit-student-modal.component.scss']
})
export class EditStudentModalComponent implements AfterViewInit {

  @Output() saved = new EventEmitter<void>();
  @ViewChild('modal') private _modalRef: ElementRef;
  private _modal: Modal;

  studentModel: EditStudentModel;
  origStudent: IStudentDto;

  blocks: BlockDto[];

  grades = [
    { value: 9, text: '9th' },
    { value: 10, text: '10th' },
    { value: 11, text: '11th' },
    { value: 12, text: '12th' }
  ];

  days = [
    { value: 0, text: 'Sunday' },
    { value: 1, text: 'Monday' },
    { value: 2, text: 'Tuesday' },
    { value: 3, text: 'Wednesday' },
    { value: 4, text: 'Thursday' },
    { value: 5, text: 'Friday' },
    { value: 6, text: 'Saturday' }
  ];


  get ModalTitle(): string {
    if (this.origStudent) {
      return `Edit ${this.origStudent.firstName} ${this.origStudent.lastName}`;
    } else {
      return `New Student`;
    }
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly blockService: BlockService,
    private readonly studentService: StudentService) {
    this.createForm();
    this.blockService.listBlocks().subscribe(blocks => { this.blocks = blocks; });
  }

  ngAfterViewInit() {
    this._modal = new Modal(this._modalRef.nativeElement, {
      dismissible: false
    });

    this.initFormControls();
  }

  open(student: IStudentDto) {
    this.origStudent = student ? student : null;
    console.log(student);
    this.createForm();
    this._modal.open();
  }

  private createForm() {
    this.studentModel = new EditStudentModel(this.fb, this.origStudent);

    setTimeout(this.initFormControls, 0);
  }


  submitForm() {
    if (this.studentModel.id) {
      const model = this.studentModel.mapToModel();
      this.studentService.updateStudent(model).subscribe((result: IApiResult) => {
        if (result.success) {
          M.toast({html: 'Student saved successfully!'});
          this.saved.emit();
          this._modal.close();
        }
      });
    } else {
      // TODO: Student creation clientside logic
    }
  }

  private initFormControls() {
    M.updateTextFields();
  }


  blockFilter(): SelectOption[] {
    return _.map(_.filter(this.blocks, (block) => {
      return _.contains(block.grades, +this.studentModel.grade);
    }), (block): SelectOption => {
      return {text: block.name, value: block.id};
    });
  }

  dayFilter(): SelectOption[] {
    const selectedBlock = _.findWhere(this.blocks, {id: this.studentModel.blockId});

    if (!selectedBlock) {
      return [];
    }

    return _.filter(this.days, (day) => {
      return _.contains(selectedBlock.days, day.value);
    });
  }

  roomFilter(): SelectOption[] {
    const selectedBlock = _.findWhere(this.blocks, {id: this.studentModel.blockId});

    if (!selectedBlock) {
      return [];
    }

    return _.map(selectedBlock.rooms, (room) => {
      return {text: room, value: room};
    });
  }

  gradeChange(newGrade: number) {
    this.studentModel.blockId = null;
    this.studentModel.blockDayOfWeek = null;
    this.studentModel.blockRoom = null;
  }

  blockChange(newBlockId: string) {
    this.studentModel.blockDayOfWeek = null;
    this.studentModel.blockRoom = null;
  }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { StudentService } from '@client/core/student/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockService } from '@client/core/blocks/block.service';
import { FormSelect } from 'materialize-css';
import { IStudent } from '@shared/interfaces/models/IStudent';
import { EditStudentModel } from '@client/features/admin/form-models/EditStudentModel';
import { BlockDto } from '@client/dtos/BlockDto';
import * as _ from 'underscore';
import { type } from 'os';
import { SelectOption } from '@client/shared/material-select/material-select.component';

@Component({
  selector: 'app-admin-edit-student',
  templateUrl: './admin-edit-student.component.html',
  styleUrls: ['./admin-edit-student.component.scss']
})
export class AdminEditStudentComponent implements OnInit {

  student: IStudent;
  blocks: BlockDto[];
  availableRooms: string[] = [];

  studentModel: EditStudentModel;

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

  get studentName(): string {
    if (!this.student) {
      return '';
    }

    return this.student.firstName + ' ' + this.student.lastName;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly studentService: StudentService,
    private readonly blockService: BlockService) {
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

  ngOnInit() {

    this.createForm();

    this.activatedRoute.paramMap
      .switchMap( (params: ParamMap) =>
        this.studentService.getStudent(params.get('id'))).subscribe((student: IStudent) => {
        this.student = student;
        this.createForm(student);
      }
    );

    this.blockService.listBlocks().subscribe(blocks => { this.blocks = blocks; });
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

  initFormControls() {
    const self = this;
    // Select Inputs
    // FormSelect.init(document.querySelectorAll('select'), {});
    //
    // document.getElementById('grade').addEventListener('change', () => {
    //   setTimeout(() => {
    //     FormSelect.init(document.querySelectorAll('select'), {});
    //     this.studentModel.Form.get('blockId').setValue(this.blockFilter()[0].id);
    //   }, 10);
    // });




    M.updateTextFields();
  }

  submitForm() {
  }

  createForm(student: IStudent = null) {
    this.studentModel = new EditStudentModel(this.fb, student);

    setTimeout(() => { this.initFormControls(); }, 0);
  }

}

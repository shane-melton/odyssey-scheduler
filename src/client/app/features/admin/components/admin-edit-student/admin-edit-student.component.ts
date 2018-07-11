import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IStudent } from '@server/modules/students/student.schema';
import 'rxjs/add/operator/switchMap';
import { StudentService } from '@client/core/student/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBlockDto } from '@shared/interfaces/scheduler/IBlock';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { BlockService } from '@client/core/blocks/block.service';
import { FormSelect } from 'materialize-css';
import * as moment from 'moment';
import { BlockDocument, IBlock } from '@server/modules/blocks/block.schema';

@Component({
  selector: 'app-admin-edit-student',
  templateUrl: './admin-edit-student.component.html',
  styleUrls: ['./admin-edit-student.component.scss']
})
export class AdminEditStudentComponent implements OnInit {

  student: IStudent;
  blocks: IBlockDto[];
  availableRooms: string[] = [];

  studentForm: FormGroup;

  grades = [
    { value: 9, text: '9th' },
    { value: 10, text: '10th' },
    { value: 11, text: '11th' },
    { value: 12, text: '12th' }
  ];

  days = [
    { value: 1, text: 'Monday' },
    { value: 2, text: 'Tuesday' },
    { value: 3, text: 'Wednesday' },
    { value: 4, text: 'Thursday' },
    { value: 5, text: 'Friday' }
  ];

  get studentName(): string {
    return this.student.firstName + ' ' + this.student.lastName;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly studentService: StudentService,
    private readonly blockService: BlockService) {
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

    this.blockService.listBlocks().subscribe(blocks => {this.blocks = blocks; console.log(this.blocks);});
  }

  initFormControls() {
    const self = this;
    // Select Inputs
    FormSelect.init(document.querySelectorAll('select'), {});


    M.updateTextFields();
  }

  submitForm() {
  }

  createForm(student: IStudent = null) {
    if (student == null) {
      student = {
        firstName: '',
        lastName: '',
        blockRoom: '',
        block: null,
        blockDayOfWeek: 0,
        grade: null,
        studentNumber: '',
        birthDate: null
      };
    }



    const formattedBirthDate = moment(student.birthDate).format('MM/DD/YYYY');
    const blockId = student.block ? (<any>student.block)._id : null;

    this.studentForm = this.fb.group({
      firstName: [student.firstName, [Validators.required]],
      lastName: [student.lastName, [Validators.required]],
      blockRoom: [student.blockRoom, [Validators.required]],
      block: [blockId, [Validators.required]],
      blockDayOfWeek: [student.blockDayOfWeek, [Validators.required]],
      grade: [student.grade, [Validators.required, Validators.min(9), Validators.max(12)]],
      studentNumber: [student.studentNumber, Validators.required],
      birthDate: [formattedBirthDate, [Validators.required, Validators.pattern('\\d{1,2}\\/\\d{1,2}\\/\\d{4}')]]
    });

    setTimeout(() => { this.initFormControls(); }, 0);
  }

}

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
import { IStudentDto } from '@client/dtos/IStudentDto';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { IReservationDto } from '@client/dtos/IReservationDto';

@Component({
  selector: 'app-admin-edit-student',
  templateUrl: './admin-view-student.component.html',
  styleUrls: ['./admin-view-student.component.scss']
})
export class AdminViewStudentComponent implements OnInit {
  student: IStudentDto;
  reservations: IReservationDto[];


  get studentName(): string {
    if (!this.student) {
      return '';
    }

    return this.student.firstName + ' ' + this.student.lastName;
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly studentService: StudentService,
    private readonly schedulerService: SchedulerService) {
    this.student = <IStudentDto> {};
    this.reservations = [];
  }

  ngOnInit() {
    this.loadStudent();

  }

  loadStudent() {
    this.activatedRoute.paramMap
      .switchMap( (params: ParamMap) =>
        this.studentService.getStudent(params.get('id'))).subscribe((student: IStudentDto) => {
        this.student = student;
        this.loadReservations();
      }
    );
  }

  loadReservations() {
    if (!this.student) {
      return;
    }

    this.schedulerService.listReservationsForStudent(this.student.id).subscribe((reservations: IReservationDto[]) => {
      this.reservations = _.sortBy(reservations, 'makeupDate').reverse();
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
import { ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { IApiResult } from '@shared/interfaces/api';
import { ConfirmDelete } from '@client/helpers/swal-helpers';

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
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly studentService: StudentService,
    private readonly schedulerService: SchedulerService) {
    this.student = <IStudentDto> {};
    this.reservations = [];
  }

  ngOnInit() {
    this.loadStudent();
  }

  async deleteReservation(resId: string) {
    if (!await ConfirmDelete('Are you sure you want to delete this scheduled makeup?')) {
      return;
    }

    this.schedulerService.deleteReservation(resId).subscribe((result: IApiResult) => {
      if (result.success) {
        M.toast({html: 'Reservation deleted!'});
        this.loadReservations();
      }
    });
  }

  async deleteStudent() {
    if (!await ConfirmDelete('Are you sure you want to delete this student?')) {
      return;
    }


    this.studentService.deleteStudent(this.student.id).subscribe((result: IApiResult) => {
      if (result.success) {
        M.toast({html: 'Student deleted!'});
        this.router.navigate(['/admin/dash']);
      }
    });

  }

  loadStudent() {
    this.activatedRoute.paramMap
      .switchMap( (params: ParamMap) =>
        this.studentService.getStudent(params.get('id'))).subscribe((student: IStudentDto) => {
          if (student == null) {
            M.toast({html: 'Student not found!'});
            this.router.navigate(['/admin/dash']);
            return;
          }
        this.student = student;
        this.loadReservations();
      }
    );
  }

  updatePage(newStudentNumber: string) {
    console.log(newStudentNumber, this.student.studentNumber);
    if (newStudentNumber === this.student.studentNumber) {
      this.loadStudent();
    } else {
      this.router.navigateByUrl(`/admin/students/${newStudentNumber}/view`);
    }
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

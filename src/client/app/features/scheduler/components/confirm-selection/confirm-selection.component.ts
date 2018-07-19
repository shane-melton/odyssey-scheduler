import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IClass } from '@shared/interfaces/models/ISchoolDay';
import { AuthService } from '@client/core/auth/auth.service';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import {StudentService} from '@client/core/student/student.service';
import { IStudent } from '@shared/interfaces/models/IStudent';

@Component({
  selector: 'app-confirm-selection',
  templateUrl: './confirm-selection.component.html',
  styleUrls: ['./confirm-selection.component.scss']
})
export class ConfirmSelectionComponent implements OnInit {

  missedClass: IClass;
  makeupClass: IClass;
  student: IStudent;
  confirmed = false;
  error = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly scheduler: SchedulerService,
    private readonly studentService: StudentService
  ) { }

  moment(d: Date, f: string): string {
    return moment(d).format(f);
  }

  confirmSelection() {
    this.scheduler.makeReservationForCurrentSelection().subscribe(result => {
      if (result.success) {
        this.confirmed = true;
      }
    });
  }

  async signOut() {
    this.authService.logout();
    await this.router.navigate(['../']);
  }

  async ngOnInit() {
    this.missedClass = this.scheduler.MissedSelection;
    this.makeupClass = this.scheduler.MakeupSelection;

    if (!this.missedClass || this.missedClass == null ||
      !this.makeupClass || this.makeupClass == null) {
      await this.router.navigate(['../missed']);
    }

    this.studentService.getCurrentStudent().subscribe((student: IStudent) => {
      this.student = student;
    });
  }

}

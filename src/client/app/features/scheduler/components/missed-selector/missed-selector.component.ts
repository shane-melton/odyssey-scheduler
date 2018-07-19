import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IClassBlock, ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { Router } from '@angular/router';
import { AuthService } from '@client/core/auth/auth.service';
import {StudentService} from '@client/core/student/student.service';
import { IStudent } from '@shared/interfaces/models/IStudent';

@Component({
  selector: 'app-missed-selector',
  templateUrl: './missed-selector.component.html',
  styleUrls: ['./missed-selector.component.scss']
})
export class MissedSelectorComponent implements OnInit {

  schoolDays: ISchoolDay[];
  student: IStudent;

  constructor(
    private readonly scheduler: SchedulerService,
    private readonly auth: AuthService,
    private readonly studentService: StudentService,
    private readonly router: Router
  ) {}

  moment(d: Date, f: string): string {
    return moment(d).format(f);
  }

  ngOnInit() {
    this.scheduler.getRecentClasses().subscribe((days: ISchoolDay[]) => {
      this.schoolDays = days;
    });

    console.log('Init Missed!');

    this.studentService.getCurrentStudent().subscribe((student: IStudent) => {
      console.log('Student Loaded!', student);
      this.student = student;
    });
  }

  selectClass(block: IClassBlock, missedDate: Date) {
    this.scheduler.setMissedSelection(block, missedDate);
    return this.router.navigate(['../makeup']);
  }

  signOut() {
    this.auth.logout();
    this.router.navigate(['../']);
  }
}

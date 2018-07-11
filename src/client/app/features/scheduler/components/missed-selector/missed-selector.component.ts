import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IClassBlockDto, ISchoolDayDto } from '@shared/interfaces/scheduler/ISchoolDay';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { Router } from '@angular/router';
import { AuthService } from '@client/core/auth/auth.service';
import {StudentService} from '@client/core/student/student.service';
import {IStudent} from '@server/modules/students/student.schema';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-missed-selector',
  templateUrl: './missed-selector.component.html',
  styleUrls: ['./missed-selector.component.scss']
})
export class MissedSelectorComponent implements OnInit {

  schoolDays: ISchoolDayDto[];
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
    this.scheduler.getRecentClasses().subscribe((days: ISchoolDayDto[]) => {
      this.schoolDays = days;
    });

    console.log('Init Missed!');

    this.studentService.getCurrentStudent().subscribe((student: IStudent) => {
      console.log('Student Loaded!', student);
      this.student = student;
    });
  }

  selectClass(block: IClassBlockDto, missedDate: Date) {
    this.scheduler.setMissedSelection(block, missedDate);
    return this.router.navigate(['../makeup']);
  }

  signOut() {
    this.auth.logout();
    this.router.navigate(['../']);
  }
}

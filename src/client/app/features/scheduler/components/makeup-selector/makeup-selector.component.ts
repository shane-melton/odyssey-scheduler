import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IClassBlock, IClass, ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { AuthService } from '@client/core/auth/auth.service';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import {StudentService} from '@client/core/student/student.service';
import { IStudent } from '@shared/interfaces/models/IStudent';

@Component({
  selector: 'app-makeup-selector',
  templateUrl: './makeup-selector.component.html',
  styleUrls: ['./makeup-selector.component.scss']
})
export class MakeupSelectorComponent implements OnInit {

  missedClass: IClass;
  schoolDays: ISchoolDay[];
  student: IStudent;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly scheduler: SchedulerService,
    private readonly studentService: StudentService
  ) { }

  moment(d: Date, f: string): string {
    return moment(d).format(f);
  }

  async ngOnInit() {
    this.missedClass = this.scheduler.MissedSelection;

    if (!this.missedClass || this.missedClass == null) {
      await this.router.navigate(['../missed']);
    }

    this.scheduler.getAvailableMakeupClasses().subscribe((days: ISchoolDay[]) => {
      this.schoolDays = days;
    });

    this.studentService.getCurrentStudent().subscribe((student: IStudent) => {
      this.student = student;
    });
  }

  async selectClass(block: IClassBlock, classDate: Date) {
    this.scheduler.setMakeupSelection(block, classDate);
    await this.router.navigate(['../confirm']);
  }

  async signOut() {
    this.authService.logout();
    await this.router.navigate(['../']);
  }

}

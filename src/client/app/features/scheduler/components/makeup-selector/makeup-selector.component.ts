import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IBlockDto, IClassDto, ISchoolDayDto } from '@shared/interfaces/scheduler/ISchoolDay';
import { AuthService } from '@client/core/auth/auth.service';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';

@Component({
  selector: 'app-makeup-selector',
  templateUrl: './makeup-selector.component.html',
  styleUrls: ['./makeup-selector.component.scss']
})
export class MakeupSelectorComponent implements OnInit {

  missedClass: IClassDto;
  schoolDays: ISchoolDayDto[];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly scheduler: SchedulerService
  ) { }

  moment(d: Date, f: string): string {
    return moment(d).format(f);
  }

  async ngOnInit() {
    this.missedClass = this.scheduler.MissedSelection;

    if (!this.missedClass || this.missedClass == null) {
      await this.router.navigate(['../missed']);
    }

    this.scheduler.getAvailableMakeupClasses().subscribe((days: ISchoolDayDto[]) => {
      this.schoolDays = days;
    });
  }

  async selectClass(block: IBlockDto, classDate: Date) {
    this.scheduler.setMakeupSelection(block, classDate);
    await this.router.navigate(['../confirm']);
  }

  async signOut() {
    this.authService.logout();
    await this.router.navigate(['../']);
  }

}

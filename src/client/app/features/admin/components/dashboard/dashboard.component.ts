import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IReservationDto } from '@shared/interfaces/scheduler/IReservationDto';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/operators';
import * as moment from 'moment';
import { forkJoin } from 'rxjs/observable/forkJoin';


interface MakeupCounts {
  total: number;
  checkedIn: number;
  missing: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('weekChart') weekChartCanvas: ElementRef;

  todaysReservations: IReservationDto[] = [];
  tomorrowsReservations: IReservationDto[] = [];

  todaysCounts: MakeupCounts;
  tomorrowsCounts: MakeupCounts;


  constructor(private readonly schedulerService: SchedulerService) {
    this.updateCounts();
  }

  ngOnInit() {
    const chart = new Chart(this.weekChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
          {
            label: 'Scheduled Makeups',
            backgroundColor: 'rgba(80, 163, 162, .5)',
            borderColor: 'rgba(80, 163, 162, 1)',
            borderWidth: 2,
            data: [0, 0, 13, 6, 14]
          },
          {
            label: 'Checked In',
            backgroundColor: 'rgba(97, 122, 179, .5)',
            borderColor: 'rgba(97, 122, 179, 1)',
            borderWidth: 2,
            data: [5, 8, 0, 0, 0]
          },
          {
            label: 'Missing',
            backgroundColor: 'rgba(80, 163, 162, .5)',
            borderColor: 'rgba(80, 163, 162, 1)',
            borderWidth: 2,
            data: [15, 12, 0, 0, 0]
          },
        ]
      },
      options: {
        legend: {display: false},
        title: {display: false},
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            display: true,
            stacked: true,
            ticks: {
              min: 0
            }
          }]
        }
      }
    });

    forkJoin(
      this.schedulerService.listReservations(new Date()),
      this.schedulerService.listReservations(moment().add(1, 'day').toDate())
    )
    .subscribe(([today, tomorrow]) => {
      this.todaysReservations = today;
      this.tomorrowsReservations = tomorrow;
      this.updateCounts();
    });

  }

  private updateCounts() {
    this.todaysCounts = {
      total: this.todaysReservations.length,
      checkedIn: 0,
      missing: 0
    };

    this.todaysCounts.checkedIn = _.reduce(this.todaysReservations, (memo, res: IReservationDto) => {
      return memo + (res.checkedIn ? 1 : 0);
    }, 0);

    this.todaysCounts.missing = this.todaysCounts.total - this.todaysCounts.checkedIn;

    this.tomorrowsCounts = {
      total: this.tomorrowsReservations.length,
      checkedIn: 0,
      missing: 0
    };

    this.tomorrowsCounts.checkedIn = _.reduce(this.tomorrowsReservations, (memo, res: IReservationDto) => {
      return memo + (res.checkedIn ? 1 : 0);
    }, 0);

    this.tomorrowsCounts.missing = this.tomorrowsCounts.total - this.tomorrowsCounts.checkedIn;
  }

}

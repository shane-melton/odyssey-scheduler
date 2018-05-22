import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('weekChart') weekChartCanvas: ElementRef;

  constructor() {
  }

  ngOnInit() {
    const chart = new Chart(this.weekChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
          {
            label: 'Scheduled Makeups',
            backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
            data: [15, 12, 13, 6, 14]
          }
        ]
      },
      options: {
        legend: {display: false},
        title: {display: false},
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              min: 0
            }
          }]
        }
      }
    });
  }

}

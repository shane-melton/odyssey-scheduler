import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleBackgroundComponent } from './bubble-background/bubble-background.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TocDirective } from './toc.directive';
import { GradesPipe } from './pipes/grades.pipe';
import { ReservationFilterPipe } from './pipes/reservation-filter.pipe';
import { MaterialSelectComponent } from './material-select/material-select.component';
import { DayOfWeekPipe } from './pipes/day-of-week.pipe';
import { TruthyPipe } from './pipes/truthy.pipe';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [BubbleBackgroundComponent, TocDirective, GradesPipe, ReservationFilterPipe, MaterialSelectComponent, DayOfWeekPipe, TruthyPipe],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BubbleBackgroundComponent,
    TocDirective,
    GradesPipe,
    ReservationFilterPipe,
    DayOfWeekPipe,
    TruthyPipe,
    MaterialSelectComponent
  ]
})
export class SharedModule { }

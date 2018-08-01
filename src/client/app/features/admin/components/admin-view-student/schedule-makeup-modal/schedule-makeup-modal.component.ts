import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Modal } from 'materialize-css';
import { IStudentDto } from '@client/dtos/IStudentDto';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { ISchoolDay } from '@shared/interfaces/models/ISchoolDay';
import { SelectOption } from '@client/shared/material-select/material-select.component';
import * as _ from 'underscore';
import * as moment from 'moment';
import Datepicker = M.Datepicker;
import { IApiResult } from '@shared/interfaces/api';

@Component({
  selector: 'app-schedule-makeup-modal',
  templateUrl: './schedule-makeup-modal.component.html',
  styleUrls: ['./schedule-makeup-modal.component.scss']
})
export class ScheduleMakeupModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modal') private _modalRef: ElementRef;
  private _modal: Modal;

  @ViewChild('missedDayPicker') private _missedDayPickerRef: ElementRef;
  @ViewChild('makeupDayPicker') private _makeupDayPickerRef: ElementRef;

  @Output()
  saved = new EventEmitter();

  @Input()
  student: IStudentDto = <IStudentDto>{};

  // private _recentSchoolDays: ISchoolDay[] = [];
  availableMakeups: ISchoolDay[] = [];

  selectedMissedDay: Date = null;
  selectedMakeupDay: Date = null;
  dateRestrictions = true;

  // get recentSchoolDays(): SelectOption[] {
  //   return _.map(this._recentSchoolDays, (day: ISchoolDay) => {
  //     return {
  //       text: moment(day.classDate).format('dddd, MMMM Do, YYYY'),
  //       value: day.classDate
  //     };
  //   });
  // }

  get StudentName(): string {
    return this.student.firstName + ' ' + this.student.lastName;
  }

  constructor(private readonly schedulerService: SchedulerService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._modal = new Modal(this._modalRef.nativeElement, {
      dismissible: false
    });


  }

  toggleDateRestrictions() {
    this.dateRestrictions = !this.dateRestrictions;
    this.initMakeupDayPicker();
    this.initMissedDayPicker();
  }

  open() {
    if (this.student) {
      this.initMissedDayPicker();
      this._modal.open();
    }
  }

  resetForm() {
    this.selectedMakeupDay = null;
    this.selectedMissedDay = null;
    this.dateRestrictions = true;

    this._makeupDayPickerRef.nativeElement.value = null;
    this._missedDayPickerRef.nativeElement.value = null;

  }

  submitForm() {
    this.schedulerService
      .adminMakeReservation(this.student.studentNumber,
        this.selectedMissedDay, this.selectedMakeupDay,
        this.student.block.id, this.dateRestrictions)
      .subscribe((result: IApiResult) => {
        if (result.success) {
          M.toast({html: 'Created reservation!'});
          this.saved.emit();
          this.resetForm();
          this._modal.close();
        } else {
          M.toast({html: result.errorMsg});
        }
      });
  }

  private initMissedDayPicker() {

    let minDate = moment().subtract(7, 'day').toDate();

    if (!this.dateRestrictions) {
      minDate = null;
    }

    Datepicker.init(this._missedDayPickerRef.nativeElement, {
      container: document.body,
      autoClose: true,
      minDate,
      format: 'dddd, mmmm dd, yyyy',
      disableDayFn: (input: Date): boolean => {
        if (!this.student || !this.dateRestrictions) {
          return false;
        }
        return input.getDay() !== this.student.blockDayOfWeek;
      },
      onSelect: selectedDate => {
        this.selectedMissedDay = selectedDate;
        this.initMakeupDayPicker();
      }
    });
  }

  private initMakeupDayPicker() {

    let minDate = _.max([new Date(), moment(this.selectedMissedDay).subtract(6, 'day').toDate()]);
    let maxDate = moment(this.selectedMissedDay).add(6, 'day').toDate();

    if (!this.dateRestrictions) {
      minDate = null;
      maxDate = null;
    }

    Datepicker.init(this._makeupDayPickerRef.nativeElement, {
      container: document.body,
      autoClose: true,
      minDate,
      maxDate,
      format: 'dddd, mmmm dd, yyyy',
      disableDayFn: (input: Date): boolean => {
        if (!this.student || !this.student.block || !this.dateRestrictions) {
          return false;
        }

        if (moment(this.selectedMissedDay).isSame(moment(input), 'day')) {
          return true;
        }

        return !_.contains(this.student.block.makeupDays, input.getDay());
      },
      onSelect: selectedDate => {
        this.selectedMakeupDay = selectedDate;
      }
    });
  }

}

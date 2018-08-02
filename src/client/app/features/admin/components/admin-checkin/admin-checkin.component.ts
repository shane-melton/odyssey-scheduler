import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Datepicker = M.Datepicker;
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { Moment } from 'moment';
import * as _ from 'underscore';
import { IReservationDto } from '@client/dtos/IReservationDto';
import { ConfirmDelete } from '@client/helpers/swal-helpers';
import { IApiResult } from '@shared/interfaces/api';
import * as copy from 'copy-to-clipboard';

@Component({
  selector: 'app-admin-checkin',
  templateUrl: './admin-checkin.component.html',
  styleUrls: ['./admin-checkin.component.scss']
})
export class AdminCheckinComponent implements OnInit {

  date: Date;
  picker: Datepicker;
  searchText: string;
  showCheckedIn = false;
  reservations: IReservationDto[] = [];
  shownReservations: IReservationDto[] = [];
  badFilter = false;

  constructor(private readonly schedulerService: SchedulerService) {
    this.date = new Date();
    this.updateDate(this.date);
  }

  moment(date: Date): Moment {
    return moment(date);
  }

  updateTable() {

    if (!this.showCheckedIn) {
      this.shownReservations = _.filter(this.reservations, res => {
        return !res.checkedIn;
      });
    } else {
      this.shownReservations = this.reservations;
    }

    this.filterReservations();
  }

  checkInStudent(res: IReservationDto) {
    const newStatus = res.checkedIn;

    this.schedulerService.updateReservationStatus(res.id, res.checkedIn).subscribe((success) => {
      if (success) {
        M.toast(
          {
            html: newStatus ? 'Check-in successful!' : 'Check-out successful!'
          });
      } else {
        res.checkedIn = !newStatus;
        M.toast(
          {
            html: newStatus ? 'Check-in failed!!' : 'Check-out failed!!'
          });
        this.updateTable();
      }
    });

    this.updateTable();
  }

  async deleteReservation(res: IReservationDto) {
    if (!await ConfirmDelete('Are you sure you want to delete this scheduled makeup?')) {
      return;
    }
    this.schedulerService.deleteReservation(res.id).subscribe((result: IApiResult) => {
      if (result.success) {
        this.updateDate(this.date);
      }
    });
  }

  filterReservations() {

    this.badFilter = false;
    if (!this.searchText) {
      return this.shownReservations;
    }

    const s = this.searchText.toLowerCase();

    const result =  _.filter(this.shownReservations, (it: IReservationDto) => {
      const name = (it.student.firstName + ' ' + it.student.lastName).toLowerCase();
      return name.includes(s);
    });

    if (!result.length) {
      this.badFilter = true;
    }

    return result;

  }

  ngOnInit() {
    this.picker = Datepicker.init(
      document.querySelector('.datepicker'),
      {
        defaultDate: this.date,
        setDefaultDate: true,
        minDate: moment().toDate(),
        autoClose: true,
        container: document.body,
        onSelect: this.updateDate.bind(this)
      });
  }

  updateDate(selectedDate: Date) {
    this.date = selectedDate;

    this.schedulerService.listReservations(this.date).subscribe((reservations: IReservationDto[]) => {
      this.reservations = reservations;
      this.updateTable();
    });
  }

  copyCheckedInToClipboard() {
    const text = _.chain(this.reservations)
      .filter(res => res.checkedIn)
      .groupBy(res => res.student.blockRoom)
      .reduce((memo: string, resList: IReservationDto[], room: any): string => {
        let val = 'Room ' + room + '\n';

        _.each(resList, res => {
          val += `\t ${res.student.firstName} ${res.student.lastName}\n`;
        });

        return memo + val;
      }, '').value();

    if (text && text.length) {
      copy(text);
      M.toast({html: 'Students copied to clipboard!'});
    } else {
      M.toast({html: 'Nothing copied! Is anyone checked in?'});
    }


  }

  openDatePicker() {
    this.picker.open();
  }

  get day(): string {
    return moment(this.date).calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: '[this] dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'MMMM Do'
    });
  }

  get allCheckedIn(): boolean {

    if (this.reservations.length === 0) {
      return false;
    }


    return _.reduce(this.reservations, (memo, res: IReservationDto) => {
      return memo && res.checkedIn;
    }, true);
  }

}

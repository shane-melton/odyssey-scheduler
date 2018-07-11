import { Component, OnInit } from '@angular/core';
import Datepicker = M.Datepicker;
import * as moment from 'moment';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { IReservationDto } from '@shared/interfaces/scheduler/IReservationDto';
import { DomSanitizer } from '@angular/platform-browser';

import printJs from 'print-js';
import { BlockDto, IBlockDto } from '@shared/interfaces/scheduler/IBlock';
import * as _ from 'underscore';
import { Moment } from 'moment';

interface RoomRoster {
  roomName: string;
  blockName: string;

  students: string[];
}

@Component({
  selector: 'app-admin-print',
  templateUrl: './admin-print.component.html',
  styleUrls: ['./admin-print.component.scss']
})
export class AdminPrintComponent implements OnInit {

  printDate: Date;
  picker: Datepicker;
  res: IReservationDto[];
  rooms: RoomRoster[] = [];

  get day(): string {
    return moment(this.printDate).calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: '[this] dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'MMMM Do'
    });
  }

  constructor(private readonly schedulerService: SchedulerService,
              private readonly sanitizer: DomSanitizer) {
    this.res = [];
    this.updatePrintDate(moment().add(1, 'day').toDate());
  }

  openDatePicker() {
    this.picker.open();
  }

  updatePrintDate(selectedDate: Date) {
    this.printDate = selectedDate;

    this.schedulerService.listReservations(this.printDate).subscribe((reservations: IReservationDto[]) => {
      this.res = reservations;
      this.updateRosters();
    });
  }

  emptyRows() {
    return Array(5).fill(0);
  }

  moment(date: Date): Moment {
    return moment(date);
  }

  updateRosters() {
    this.rooms = [];
    _.each(this.res, (r: IReservationDto) => {
      let room = _.findWhere(this.rooms, {roomName: r.student.blockRoom});

      if (!room) {
        room = {
          roomName: r.student.blockRoom,
          blockName: r.block.name,
          students: []
        };

        this.rooms.push(room);
      }

      const studentName = r.student.lastName + ', ' + r.student.firstName;
      const index = _.sortedIndex(room.students, studentName);

      room.students.splice(index, 0, studentName);
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  printMakeupSlips() {

    const title = document.title;

    document.title = 'Makeup Slips';

    printJs({
      printable: 'print-makeup',
      type: 'html',
      documentTitle: 'Makeup',
      css: `http://${window.location.host}/assets/print-forms.css`,
      scanStyles: false
    });

    setTimeout(() => {
      document.title = title;
    }, 50);
  }

  formatOriginalDay(res: IReservationDto): string {
    const block = BlockDto.fromIBlock(<IBlockDto> res.student.block);
    const dayOfWeek = moment(res.missedDate).format('dddd');

    return dayOfWeek + ' ' + block.timeRange(true);
  }

  formatMakeupDay(res: IReservationDto): string {
    const block = BlockDto.fromIBlock(<IBlockDto> res.block);
    const dayOfWeek = moment(res.makeupDate).format('dddd');

    return dayOfWeek + ' ' + block.timeRange(true);
  }

  printRoster() {
    document.getElementById('print-roster').style.visibility = 'visible';

    printJs({
      printable: 'print-roster',
      type: 'html',
      documentTitle: 'Rosters',
      css: 'http://localhost:4200/assets/print-forms.css',
      scanStyles: false
    });

    document.getElementById('print-roster').style.visibility = 'hidden';

  }

  ngOnInit() {
    this.picker = Datepicker.init(
      document.querySelector('.datepicker'),
      {
        defaultDate: this.printDate,
        setDefaultDate: true,
        minDate: moment().toDate(),
        autoClose: true,
        container: document.body,
        onSelect: this.updatePrintDate.bind(this)
      });
  }
}

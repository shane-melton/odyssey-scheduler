import { Component, OnInit } from '@angular/core';
import html2pdf from 'html2pdf.js';
import Datepicker = M.Datepicker;
import * as moment from 'moment';
import { SchedulerService } from '@client/core/scheduler/scheduler.service';
import { IReservation } from '@server/modules/reservations/reservation.schema';
import { IReservationDto } from '@shared/interfaces/scheduler/IReservationDto';
import { DomSanitizer } from '@angular/platform-browser';

import printJs from 'print-js';
import { BlockDocument, IBlock } from '@server/modules/blocks/block.schema';
import { BlockDto, IBlockDto } from '@shared/interfaces/scheduler/IBlock';

@Component({
  selector: 'app-admin-print',
  templateUrl: './admin-print.component.html',
  styleUrls: ['./admin-print.component.scss']
})
export class AdminPrintComponent implements OnInit {

  printDate: Date;
  picker: Datepicker;
  res: IReservationDto[];
  test: string;

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
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  printMakeupSlips() {

    document.getElementById('print-me').style.visibility = 'visible';

    printJs({
      printable: 'print-me',
      type: 'html',
      documentTitle: 'Test',
      css: 'http://localhost:4200/assets/print.css',
      scanStyles: false
      // targetStyles: [
      //   'border',
      //   'width',
      //   'margin',
      //   'border',
      //   'padding',
      //   'text-align',
      //   'text-transform',
      //   'font-size',
      //   'display',
      //   'font-weight',
      //   'page-break-after',
      //   'break-after'
      // ]
    });

    document.getElementById('print-me').style.visibility = 'hidden';
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



  oldHtml2Pdf() {
    const el = document.getElementById('print-me');

    const opt = {
      image: {type: 'jpeg', quality: 1.0}
    };

    html2pdf().from(el).set(opt).output('bloburi', {}, 'pdf').then(data => {
      document.getElementById('embed').setAttribute('src', data);
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 5000);
    });
  }

}

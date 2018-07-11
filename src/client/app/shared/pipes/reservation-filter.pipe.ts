import { Pipe, PipeTransform } from '@angular/core';
import { IReservationDto } from '@shared/interfaces/scheduler/IReservationDto';
import * as _ from 'underscore';

@Pipe({
  name: 'reservationFilter'
})
export class ReservationFilterPipe implements PipeTransform {

  transform(items: IReservationDto[], searchText: string): IReservationDto[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    console.log(searchText);

    searchText = searchText.toLowerCase();

    return _.sortBy(_.filter(items, (it: IReservationDto) => {
      const name = (it.student.firstName + ' ' + it.student.lastName).toLowerCase();
      return name.includes(searchText);
    }), 'checkedIn');

  }

}

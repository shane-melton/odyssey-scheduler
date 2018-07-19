import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';
import { IReservationDto } from '@client/dtos/IReservationDto';

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

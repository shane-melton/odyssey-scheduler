import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'grades'
})
export class GradesPipe implements PipeTransform {

  transform(value: number[], args?: any): any {
    let output = '';

    if (!_.isArray(value) && _.isNumber(value)) {
      value = [value];
    }

    _.each(value, (grade: number, index: number) => {

      output += this.ordinal_suffix(grade);

      if (index < value.length - 1) {
        output += ', ';
      }
    });

    return output;
  }

  ordinal_suffix(i) {
    const j = i % 10,
          k = i % 100;
    if (j === 1 && k !== 11) {
      return i + 'st';
    }
    if (j === 2 && k !== 12) {
      return i + 'nd';
    }
    if (j === 3 && k !== 13) {
      return i + 'rd';
    }
    return i + 'th';
  }

}

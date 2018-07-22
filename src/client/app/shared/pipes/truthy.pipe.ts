import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'truthy'
})
export class TruthyPipe implements PipeTransform {

  transform(value: boolean, args?: any): any {
    if (args && _.isArray(args) && args.length === 2) {
      return value ? args[0] : args[1];
    }

    return this.processStandardOptions(value, args);
  }

  private processStandardOptions(value: boolean, option: string): string {
    switch (option) {
      case 'yesno':
        return value ? 'Yes' : 'No';
      case 'enable':
        return value ? 'Enable' : 'Disable';
      case 'enabled':
        return value ? 'Enabled' : 'Disabled';
      case 'true':
      default:
        return value ? 'True' : 'False';
    }
  }

}

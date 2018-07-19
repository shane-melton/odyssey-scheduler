import * as _ from 'underscore';

export function getMongooseId(item: {id?: any} | string): string {
  if (_.isString(item)) {
    return item;
  } else if (_.isObject(item) && _.isString(item.id)) {
    return item.id;
  } else {
    return '';
  }
}

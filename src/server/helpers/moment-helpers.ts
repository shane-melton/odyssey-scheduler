import * as moment from 'moment';

export function MinutesOfDay(m: moment.Moment): number {
    return m.minutes() + m.hours() * 60;
}
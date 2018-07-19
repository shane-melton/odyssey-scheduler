/**
 * Primary Block interface that describes all properties that belong to a Block Entity
 */
export interface IBlock {
  id?: any;
  name: string;
  icSlug: string;
  days: number[];
  makeupDays: number[];
  grades: number[];
  startTime: Date;
  endTime: Date;
  maxStudents: number;
  rooms: string[];
}


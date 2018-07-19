/**
 * Represents a school day on a particular date and contains the list of available class blocks
 * available for that day.
 */
export interface ISchoolDay {
  classDate: Date;
  blocks: IClassBlock[];
}

export interface IClassBlock {
  blockId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  openSpots?: number;
}

/**
 * Represents a specific class instance which includes a specific date and block.
 */
export interface IClass {
  classDate: Date;
  block: IClassBlock;
}

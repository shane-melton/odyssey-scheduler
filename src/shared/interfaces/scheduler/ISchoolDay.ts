/**
 * Represents a school day on a particular date and contains the list of available class blocks
 * available for that day.
 */
export interface ISchoolDayDto {
  classDate: Date;
  blocks: IBlockDto[];
}

export interface IBlockDto {
  blockId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  openSpots?: number;
}

/**
 * Represents a specific class instance which includes a specific date and block.
 */
export interface IClassDto {
  classDate: Date;
  block: IBlockDto;
}

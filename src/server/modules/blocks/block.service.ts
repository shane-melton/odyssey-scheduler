import { Component, Inject } from '@nestjs/common';
import { ProviderTokens } from '@server/constants';
import { BlockDocument, IBlock } from './block.schema';
import { Model } from 'mongoose';
import { ICreateBlockDto } from '@shared/interfaces/scheduler/IBlock';
import * as moment from 'moment';

@Component()
export class BlockService {
  constructor(
    @Inject(ProviderTokens.Block) private readonly blockModel: Model<BlockDocument>
  ) {}

  /**
   * Finds a block using the provided blockId, null is returned if none is found
   * @param {string} blockId - The Id of the block to find
   * @returns {Promise<IBlock>}
   */
  async getBlock(blockId: string): Promise<BlockDocument> {
    return await this.blockModel.findById(blockId).exec();
  }

  /**
   * Finds any blocks that are applicable to any of the provided list of grades
   * @param {number[]} grades - An array of grades to search with
   * @returns {Promise<IBlock[]>}
   */
  async getBlocksForGrades(grades: number[]): Promise<BlockDocument[]> {
    return await this.blockModel.find({grades: {$in: grades}}).exec();
  }

  async listBlocks(): Promise<BlockDocument[]> {
    return await this.blockModel.find().lean().exec();
  }

  async createBlock(newBlockDto: ICreateBlockDto): Promise<boolean> {
    const newBlock: IBlock = {
      maxStudents: newBlockDto.maxStudents,
      name: newBlockDto.name,
      makeupDays: newBlockDto.makeupDays,
      days: newBlockDto.days,
      grades: newBlockDto.grades,
      startTime: moment(newBlockDto.startTime, 'HH:mm a').toDate(),
      endTime: moment(newBlockDto.endTime, 'HH:mm a').toDate(),
      rooms: newBlockDto.rooms
    };

    const blockDoc = await this.blockModel.create(newBlock);

    return !!blockDoc;
  }

}

import { Component, Inject } from '@nestjs/common';
import { ProviderTokens } from '@server/constants';
import { BlockDocument, IBlock } from './block.schema';
import { Model } from 'mongoose';

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
}

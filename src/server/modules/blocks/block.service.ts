import { Component, Inject } from '@nestjs/common';
import { ProviderTokens } from '@server/constants';
import { BlockDocument } from './block.schema';
import { Model } from 'mongoose';
import { IBlock } from '@shared/interfaces/models/IBlock';

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
    return await this.blockModel.find().exec();
  }

  async updateBlock(block: IBlock): Promise<boolean> {
    return this.blockModel.updateOne({_id: block.id}, block);
  }

  async deleteBlock(blockId: string): Promise<boolean> {
    return this.blockModel.deleteOne({_id: blockId});
  }

  async createBlock(newBlock: IBlock): Promise<boolean> {
    const blockDoc = await this.blockModel.create(newBlock);

    return !!blockDoc;
  }

}

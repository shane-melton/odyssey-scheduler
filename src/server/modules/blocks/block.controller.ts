import {Body, Controller, Delete, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import { BlockService } from '@server/modules/blocks/block.service';
import { Roles } from '@server/decorators/role.decorator';
import { FailureException, FailureResult, IApiResult, SuccesResult } from '@shared/interfaces/api';
import { AvailableRoles } from '@server/helpers/roles';
import { RoleGuard } from '@server/modules/auth/role.guard';
import { BlockApi } from '@shared/api-endpoints';
import {BlockDto, IBlockDto} from '@shared/interfaces/scheduler/IBlock';
import { ValidationError } from 'mongoose';
import { BlockDocument } from '@server/modules/blocks/block.schema';
import * as _ from 'underscore';

@Controller()
export class BlockController {
  constructor(private readonly blockService: BlockService) {

  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Post(BlockApi.postCreateBlock)
  async createBlock(@Body() createBlockDto: IBlockDto): Promise<IApiResult> {
    try {
      const result = await this.blockService.createBlock(createBlockDto);

      if (result) {
        return new SuccesResult();
      } else {
        return new FailureResult('Failed to create block!');
      }

    } catch (exception) {
      if (exception.name === 'ValidationError') {
        return new FailureException(exception, 'Invalid block!');
      }
      return new FailureException(exception);
    }
  }
  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Post(BlockApi.postUpdateBlock)
  async updateBlock(@Body() updateBlockDto: IBlockDto): Promise<IApiResult> {
    try {
      const result = await this.blockService.updateBlock(updateBlockDto);

      if (result) {
        return new SuccesResult();
      } else {
        return new FailureResult('Failed to create block!');
      }

    } catch (exception) {
      if (exception.name === 'ValidationError') {
        return new FailureException(exception, 'Invalid block!');
      }
      return new FailureException(exception);
    }
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Delete(BlockApi.deleteBlock(':id'))
  async deleteBlock(@Param('id') blockId: string): Promise<IApiResult> {
    const result = await this.blockService.deleteBlock(blockId);

    return result ? new SuccesResult() : new FailureResult('Could not delete block!');
  }

  @UseGuards(RoleGuard)
  @Roles(AvailableRoles.ADMIN)
  @Get(BlockApi.getListBlocks)
  async listBlocks(): Promise<IApiResult<BlockDto[]>> {
    const blocks = await this.blockService.listBlocks();

    if (!blocks) {
      return new FailureResult('Unable to retrieve block list!');
    }

    return new SuccesResult(_.map(blocks, (doc: BlockDocument) => BlockDto.fromBlockDoc(doc)));
  }
}

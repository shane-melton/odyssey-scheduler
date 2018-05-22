import { Module } from '@nestjs/common';
import { BlockService } from '@server/modules/blocks/block.service';
import { blockProviders } from '@server/modules/blocks/block.schema';
import { BlockController } from '@server/modules/blocks/block.controller';

@Module({
  imports: [],
  controllers: [BlockController],
  components: [
    BlockService,
    ...blockProviders
  ],
  exports: [
    BlockService,
    ...blockProviders
  ]
})
export class BlocksModule {

}

import { Module } from '@nestjs/common';
import { BlockService } from '@server/modules/blocks/block.service';
import { blockProviders } from '@server/modules/blocks/block.schema';

@Module({
  imports: [],
  controllers: [],
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

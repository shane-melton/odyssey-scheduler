import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Global()
@Module({
  components: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}

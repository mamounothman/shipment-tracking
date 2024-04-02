import { Module } from '@nestjs/common';
import { DatabaseProviders } from './providers/database.providers';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}

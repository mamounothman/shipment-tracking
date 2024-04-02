import { Module } from '@nestjs/common';
import { DatabaseProviders } from './services/database.service';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}

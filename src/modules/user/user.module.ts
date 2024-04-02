import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserProvider } from './providers/user.provider';
import { DatabaseModule } from '../../common/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { AccessContorlService } from '../../common/services/access-control.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...UserProvider, JwtService, AccessContorlService],
  controllers: [UserController],
})
export class UserModule {}

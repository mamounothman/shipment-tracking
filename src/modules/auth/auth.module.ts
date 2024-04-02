import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../user/services/user.service';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { UserProvider } from '../user/providers/user.provider';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [
    UserService,
    AuthService,
    ...UserProvider,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

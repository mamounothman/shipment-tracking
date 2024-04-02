import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserSignUp } from '../dtos/userSignUp';
import { UserLogin } from '../dtos/userLogin';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from '../../../common/guards/userExist.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(DoesUserExist)
  @Post('signup')
  async signup(@Body() userSignup: UserSignUp) {
    return await this.authService.create(userSignup);
  }

  @Post('login')
  async login(@Body() userLogin: UserLogin) {
    return await this.authService.login(userLogin);
  }
}

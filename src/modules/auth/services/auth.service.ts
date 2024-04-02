import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, userPass: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const match = await this.comparePassword(userPass, user.password);

    if (!match) {
      return null;
    }

    const { password, updatedAt, createdAt, ...result } = user['dataValues'];
    return result;
  }

  async login(user) {
    const login = await this.validateUser(user.email, user.password);

    if (!login) {
      throw new UnauthorizedException('This email already exist');
    }
    const token = await this.generateToken(login);
    return { user, token };
  }

  public async create(user) {
    const newUser = await this.userService.createUser(user);
    const { password, ...result } = newUser['dataValues'];
    const token = await this.generateToken(result);

    return { user, token };
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}

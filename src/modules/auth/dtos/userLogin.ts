import { IsString, IsEmail, MinLength } from 'class-validator';

export class UserLogin {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;
}

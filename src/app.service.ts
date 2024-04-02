import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return '11 World 1';
  }
}

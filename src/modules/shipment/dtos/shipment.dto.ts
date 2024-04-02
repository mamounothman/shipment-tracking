import { IsNotEmpty, MinLength } from 'class-validator';
import { IsUUID } from 'sequelize-typescript';

export class Shipment {
  @IsNotEmpty()
  @MinLength(4)
  origin: string;

  @IsNotEmpty()
  @MinLength(4)
  destination: string;

  @IsNotEmpty()
  @MinLength(4)
  delivery_preferences: string;
}

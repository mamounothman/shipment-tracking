import {
  Column,
  Table,
  PrimaryKey,
  IsUUID,
  IsDate,
  Model,
} from 'sequelize-typescript';

@Table
export class BaseModel extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;
}

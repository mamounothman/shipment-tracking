import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { BaseModel } from '../../../common/database/entities/base.entity';

@Table
export class Shipment extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  origin: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  destination: string;

  @Column({
    type: DataType.ENUM,
    values: ['STANDARD', 'ECO_FRIENDLY'],
    defaultValue: 'STANDARD',
    allowNull: false,
  })
  delivery_preferences: string;

  @Column({ defaultValue: 1 })
  is_active: boolean;

  @Column({
    type: DataType.ENUM,
    values: ['SCHEDULED', 'IN_PROGRESS', 'DELIVERED', 'CANCELED'],
    defaultValue: 'SCHEDULED',
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}

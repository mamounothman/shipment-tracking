import { Table, Column, DataType, Unique } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

import { BaseModel } from '../../../common/database/entities/base.entity';

@Table
export class User extends BaseModel {
  @Unique
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Unique
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({ defaultValue: 1 })
  is_active: boolean;

  @Column({
    // type: DataType.STRING,
    type: DataType.ENUM,
    values: ['ADMIN', 'USER'],
    defaultValue: 'user',
    allowNull: false,
  })
  role: boolean;

  // @todo: add encryption to password
  // @BeforeCreate
  // static async hashPassword() {
  //     this.password = await bcrypt.hash(this.password, 10);
  // }
}

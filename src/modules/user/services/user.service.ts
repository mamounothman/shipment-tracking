import { Injectable, Inject } from '@nestjs/common';
import { UserSignUp } from '../../auth/dtos/userSignUp';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { USER_REPOSITORY } from '../../../common/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async createUser(userSignup: UserSignUp): Promise<User> {
    const pass = await this.hashPassword(userSignup.password);
    const userData = { ...userSignup, password: pass };
    const uuid = uuidv4();
    const data = {
      id: uuid,
      ...userData,
    };
    return await this.userRepository.create(data);
  }

  async updateUser(id, data): Promise<[number, User[]]> {
    let userData = { ...data };
    if (data.password) {
      const pass = await this.hashPassword(data.password);
      userData = { ...data, password: pass };
    }

    console.log(userData);
    const [affectedCount, affectedRows] = await this.userRepository.update(
      userData,
      {
        where: { id },
        returning: true,
      },
    );
    return [affectedCount, affectedRows];
  }

  async deleteUser(id): Promise<number> {
    return await this.userRepository.destroy({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async getAllUsers(
    offset: number = 1,
    limit: number = 5,
  ): Promise<{ rows: User[]; total: number; page: number }> {
    const result = await this.userRepository.findAndCountAll({ offset: ((offset - 1) * limit), limit, order: ['createdAt'] });
    return { page: offset, total: result.count, rows: result.rows };
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}

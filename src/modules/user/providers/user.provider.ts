import { User } from '../entities/user.entity';
import { USER_REPOSITORY } from '../../../common/constants';

export const UserProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];

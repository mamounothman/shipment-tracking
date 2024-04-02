import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// import { ROLE_KEY } from '../constants';

export const ROLE_KEY = 'role';

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserAdd } from '../dtos/userAdd';
import { UserService } from '../services/user.service';

import { Role } from '../../../common/enums/role.enum';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleGuard } from '../../../common/guards/role.guard';
import { AuthGuard } from '../../../common/guards/auth.guard';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('')
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.userService.getAllUsers(+page, +limit);
  }

  @Post('add')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async add(@Body() user: UserAdd) {
    return await this.userService.createUser(user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async update(@Param('id') id: number, @Body() user, @Request() req) {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Param('id') id: number, @Request() req) {
    return this.userService.deleteUser(id);
  }
}

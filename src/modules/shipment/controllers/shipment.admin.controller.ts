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
  UseInterceptors,
} from '@nestjs/common';
import { ShipmentService } from '../services/shipment.service';
import { Shipment } from '../dtos/shipment.dto';
import { AuthGuard as JwAuthGuard } from '@nestjs/passport';

import { Role } from '../../../common/enums/role.enum';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleGuard } from '../../../common/guards/role.guard';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('admin/shipment')
@UseInterceptors(CacheInterceptor)
export class ShipmentAdminController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwAuthGuard('jwt'), AuthGuard, RoleGuard)
  @Get('')
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.shipmentService.getAllShipment(+page, +limit);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwAuthGuard('jwt'), AuthGuard, RoleGuard)
  @Post('add')
  async add(@Body() addShipment: Shipment, @Request() req) {
    return this.shipmentService.addShipment(addShipment, req.user.email);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwAuthGuard('jwt'), AuthGuard, RoleGuard)
  @Get(':id')
  async get(
    @Param('id') id: number
  ) {
    return this.shipmentService.findOneById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwAuthGuard('jwt'), AuthGuard, RoleGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateShipment: Shipment,
    @Request() req,
  ) {
    console.log(id);
    return this.shipmentService.updateShipment(
      id,
      updateShipment,
      req.user.email,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwAuthGuard('jwt'), AuthGuard, RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req) {
    console.log(id);
    return this.shipmentService.deleteShipment(id, req.user.email);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwAuthGuard('jwt'), AuthGuard, RoleGuard)
  @Put(':id')
  async cancel(@Param('id') id: number) {
    return this.shipmentService.adminUpdateShipment(id, { status: 'CANCELED' });
  }
}

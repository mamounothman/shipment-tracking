import { Module } from '@nestjs/common';

import { ShipmentController } from './controllers/shipment.controller';
import { ShipmentProvider } from './providers/shipment.providers';
import { ShipmentService } from './services/shipment.service';
import { UserService } from '../user/services/user.service';
import { UserProvider } from '../user/providers/user.providers';
import { AccessContorlService } from '../../common/services/access-control.service';
import { JwtService } from '@nestjs/jwt';
import { ShipmentAdminController } from './controllers/shipment.admin.controller';

@Module({
  providers: [
    ShipmentService,
    ...ShipmentProvider,
    ...UserProvider,
    UserService,
    AccessContorlService,
    JwtService,
  ],
  controllers: [ShipmentController, ShipmentAdminController],
})
export class ShipmentModule {}

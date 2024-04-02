import { Shipment } from '../entities/shipment.entity';
import { SHIPMENT_REPOSITORY } from '../../../common/constants';

export const ShipmentProvider = [
  {
    provide: SHIPMENT_REPOSITORY,
    useValue: Shipment,
  },
];

import { Module } from '@nestjs/common';
import { ProducerService } from './services/producer.service';
import { ConsumerService } from './services/consumer.service';
import { ShipmentService } from '../../modules/shipment/services/shipment.service';
import { ShipmentProvider } from '../../modules/shipment/providers/shipment.providers';
import { UserService } from '../../modules/user/services/user.service';
import { UserProvider } from '../../modules/user/providers/user.provider';

@Module({
  providers: [ProducerService, ConsumerService, ShipmentService, ...ShipmentProvider, UserService, ...UserProvider],
  exports: [ProducerService, ConsumerService]
})
export class KafkaModule {}

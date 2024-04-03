import { Injectable, Inject, Scope, Request } from '@nestjs/common';
import { Shipment } from '../entities/shipment.entity';
import { SHIPMENT_REPOSITORY } from '../../../common/constants';
import { UserService } from '../../user/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { ProducerService } from '../../../common/kafka/services/producer.service';
import { ConsumerService } from '../../../common/kafka/services/consumer.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import {IN_PROGRESS, DELIVERED } from '../../../common/constants/index';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ShipmentService {
  constructor(
    @Inject(SHIPMENT_REPOSITORY) private shipmentRepository: typeof Shipment,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly userService: UserService,
  ) {}

  async create(data): Promise<Shipment> {
    return await this.shipmentRepository.create(data);
  }

  async findOneById(id): Promise<Shipment> {
    return await this.shipmentRepository.findOne<Shipment>({ where: { id } });
  }

  async getAllUserShipment(
    userEmail,
    offset: number = 1,
    limit: number = 5,
  ): Promise<{ rows: Shipment[]; total: number; page: number }> {
    const user = await this.userService.findOneByEmail(userEmail);
    const userData = user['dataValues'];
    const result = await this.shipmentRepository.findAndCountAll({
      where: { userId: userData.id },
      offset: (offset - 1) * limit,
      limit,
      order: ['createdAt'],
    });
    return { page: offset, total: result.count, rows: result.rows };
  }

  async getAllShipment(
    offset: number = 1,
    limit: number = 5,
  ): Promise<{ rows: Shipment[]; total: number; page: number }> {
    const result = await this.shipmentRepository.findAndCountAll({
      offset: (offset - 1) * limit,
      limit,
      order: ['createdAt'],
    });
    return { page: offset, total: result.count, rows: result.rows };
  }

  async addShipment(shipment, userEmail): Promise<Shipment> {
    const uuid = uuidv4();

    const user = await this.userService.findOneByEmail(userEmail);
    const userData = user['dataValues'];

    const shipmentData = { ...shipment, id: uuid, userId: userData.id };

    this.notifyKafka(shipmentData);

    return this.shipmentRepository.create(shipmentData);
  }

  async updateShipment(id, shipment, userEmail): Promise<[number, Shipment[]]> {
    const user = await this.userService.findOneByEmail(userEmail);
    const userData = user['dataValues'];

    const [affectedCount, affectedRows] = await this.shipmentRepository.update(
      shipment,
      {
        where: { id, userId: userData.id },
        returning: true,
      },
    );
    return [affectedCount, affectedRows];
  }

  async adminUpdateShipment(id, shipment): Promise<[number, Shipment[]]> {
    const [affectedCount, affectedRows] = await this.shipmentRepository.update(
      shipment,
      {
        where: { id },
        returning: true,
      },
    );
    return [affectedCount, affectedRows];
  }

  async deleteShipment(id, userEmail): Promise<number> {
    const user = await this.userService.findOneByEmail(userEmail);
    const userData = user['dataValues'];
    return await this.shipmentRepository.destroy({
      where: { id, userId: userData.id },
    });
  }

  notifyKafka(shipmentData) {
    const statuses = [IN_PROGRESS, DELIVERED];
    for(const x of [1, 2]) {
      const interval = 5000 * x;
      console.log(interval);
      setTimeout(() => {
        console.log(`sending data in ${x}`);
        this.producerService.produce({
          topic: 'shipment-tracking',
          messages: [
            {value: JSON.stringify({id: shipmentData.id, status: statuses[x - 1] })},
          ],
        });
      }, interval);
    }
  }

  @Cron('5 * * * * *')
  async consumeKafka() {
    await this.consumerService.consume(
        { topics: ['shipment-tracking']},
        {
            eachMessage: async ({topic, partition, message}) => {
              const shipmentData = JSON.parse(message.value.toString());
              console.log(shipmentData);
              this.adminUpdateShipment(shipmentData.id, {status: shipmentData.status});
            }
        }
    );
    // await this.consumerService.consume(
    //   { topics: ['shipment-tracking']},
    //     {
    //         eachMessage: async ({topic, partition, message}) => {
    //           const [id, shipmentData] = JSON.parse(message.value.toString());
    //           console.log(`shipment Id: ${id}, status ${shipmentData.status} !!!!!`);
    //           // this.adminUpdateShipment(id, shipmentData);
    //         }
    //     }
    // );
  }
}

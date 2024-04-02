import { Injectable, Inject, Scope, Request } from '@nestjs/common';
import { Shipment } from '../entities/shipment.entity';
import { SHIPMENT_REPOSITORY } from '../../../common/constants';
import { UserService } from '../../user/services/user.service';
import { v4 as uuidv4 } from 'uuid';
// import { REQUEST } from '@nestjs/core';
// import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ShipmentService {
  // @Inject(REQUEST) private readonly request: Request
  constructor(
    @Inject(SHIPMENT_REPOSITORY) private shipmentRepository: typeof Shipment,
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
      offset: ((offset - 1) * limit),
      limit,
      order: ['createdAt']
    });
    return { page: offset, total: result.count, rows: result.rows };
  }

  async getAllShipment(
    offset: number = 1,
    limit: number = 5,
  ): Promise<{ rows: Shipment[]; total: number; page: number }> {
    const result = await this.shipmentRepository.findAndCountAll({
      offset: ((offset - 1) * limit),
      limit,
      order: ['createdAt']
    });
    return { page: offset, total: result.count, rows: result.rows };
  }

  async addShipment(shipment, userEmail): Promise<Shipment> {
    const uuid = uuidv4();

    const user = await this.userService.findOneByEmail(userEmail);
    const userData = user['dataValues'];

    const shipmentData = { ...shipment, id: uuid, userId: userData.id };
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
}

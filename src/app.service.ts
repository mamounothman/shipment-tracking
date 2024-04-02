import { Injectable } from '@nestjs/common';
import { ProducerService } from './common/kafka/services/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async getHello() {
    this.producerService.produce({
      topic: 'test',
      messages: [{
        value: "Hello World!"
      }]
    })
    return '11 World 1';
  }
}

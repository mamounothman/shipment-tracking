import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord} from 'kafkajs';

@Injectable()
// OnApplicationShutdown
export class ProducerService implements OnModuleInit {
    private readonly kafkaServer;
    private readonly producer: Producer;
    constructor(private readonly config: ConfigService) {
        this.kafkaServer = new Kafka({
            brokers: [config.get('KAFKA_HOST') + ':' + config.get('KAFKA_PORT')]
        });
        this.producer= this.kafkaServer.producer();
    }

    async onModuleInit() {
        await this.producer.connect()
    }

    async produce(record: ProducerRecord) {
        await this.producer.send(record);
    }

    // async OnApplicationShutdown() {
    //     await this.producer.disconnect()
    // }
}

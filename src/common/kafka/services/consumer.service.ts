import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka, Producer} from 'kafkajs';

@Injectable()
export class ConsumerService {
    private readonly kafkaServer;
    private readonly producer;
    private readonly consumers;

    constructor(private readonly config: ConfigService) {
        this.kafkaServer = new Kafka({
            brokers: [config.get('KAFKA_HOST') + ':' + config.get('KAFKA_PORT')]
        });
        this.producer= this.kafkaServer.producer();
        this.consumers = [];
    }

    // async onModuleInit() {
    //     await this.producer.connect()
    // }

    async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        const consumer = this.kafkaServer.consumer({groupId: 'shipment-tracking'});
        consumer.connect();
        consumer.subscribe(topic);
        consumer.run(config);
        this.consumers.push(consumer);
    }

    // async onApplicationShutdown() {
    //     for(const consumer in this.consumers) {
    //         await consumer.disconnect();
    //     }
    // }
}

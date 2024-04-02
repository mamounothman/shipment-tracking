import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka, Producer} from 'kafkajs';

@Injectable()
// OnApplicationShutdown
export class ConsumerService implements OnModuleInit {
    private readonly kafkaServer = new Kafka({
        brokers: ['kafka:9092']
    });

    private readonly consumers: Consumer[] = [];
     

    private readonly producer: Producer = this.kafkaServer.producer();

    async onModuleInit() {
        await this.producer.connect()
    }

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

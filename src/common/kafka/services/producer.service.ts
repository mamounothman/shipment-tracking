import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord} from 'kafkajs';

@Injectable()
// OnApplicationShutdown
export class ProducerService implements OnModuleInit {
    private readonly kafkaServer = new Kafka({
        brokers: ['kafka:9092']
    });

    private readonly producer: Producer = this.kafkaServer.producer();

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

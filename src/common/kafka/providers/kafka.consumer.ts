import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "../services/consumer.service";

@Injectable()

export class KafkaConsumer implements OnModuleInit{
    constructor(private readonly consumerService: ConsumerService){}

    async onModuleInit() {
        await this.consumerService.consume(
            { topics: ['shipment-tracking']},
            {
                eachMessage: async ({topic, partition, message}) => {
                    console.log({
                        value: message.value,
                        topic: topic.toString(),
                        partition: partition.toString(),
                    });
                }
            }
        );
    }
}
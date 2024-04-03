import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheProvider } from './common/providers/cache.service';
import { KafkaModule } from './common/kafka/kafka.module';
import { KafkaConsumer } from './common/kafka/providers/kafka.consumer';
import { ScheduleModule } from '@nestjs/schedule';
// import { ShipmentService } from './modules/shipment/services/shipment.service';
// import { ShipmentProvider } from './modules/shipment/providers/shipment.providers';
// import { UserService } from './modules/user/services/user.service';
// import { UserProvider } from './modules/user/providers/user.provider';

@Module({
  imports: [
    KafkaModule,
    ScheduleModule.forRoot(),
    ShipmentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
        });
        return {
          ttl: +config.get('REDIS_TTL'),
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...CacheProvider, KafkaConsumer],
  //ShipmentService, UserService, ...ShipmentProvider,...UserProvider
})
export class AppModule {}

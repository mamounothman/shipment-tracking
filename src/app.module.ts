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

@Module({
  imports: [
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
    ShipmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...CacheProvider],
})
export class AppModule {}

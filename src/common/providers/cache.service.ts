import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
export const CacheProvider = [
  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  },
];

import { CacheModule as BaseCacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    BaseCacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_URL,
          port: process.env.REDIS_PORT,
          ttl: 0,
        };
      },
    }),
  ],
  exports: [BaseCacheModule],
})
export class CacheModule {}

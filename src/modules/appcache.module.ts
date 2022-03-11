/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheModule, Module, DynamicModule } from '@nestjs/common';
import * as RedisStore from 'cache-manager-redis-store';
import * as MemCache from 'memcache-pp';
import type { RedisClientOptions } from 'redis';
import * as MemStore from 'cache-manager-memcached-store';
import * as _ from 'lodash';

class CacheConfigurationError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

@Module({
  imports: [CacheModule],
})
export class AppCacheModule {
  static register(options?: {
    cache?: {
      redis?: {
        store?: typeof RedisStore;
        host?: string | 'localhost';
        port?: number | 6379;
        auth_pass?: string;
        db?: number | 0;
        ttl?: number | 600;
        max?: number | 5;
      };
      memCache?: {
        store?: typeof MemStore;
        driver?: MemCache;
        options: {
          hosts?: string[] | ['127.0.0.1:11211'];
        };
      };
    };
    isGlobal?: boolean;
  }): DynamicModule | never {
    const cacheConfiguration: {
      [key: string]:
        | number
        | number[]
        | string[]
        | string
        | typeof RedisStore
        | typeof MemStore
        | MemCache;
    } = options.cache?.redis ? options.cache?.redis : options.cache?.memCache;

    if (_.isEmpty(cacheConfiguration)) {
      throw new CacheConfigurationError(
        'No/Incomplete configuration for cache ',
      );
    }
    return options.cache.redis
      ? CacheModule.register<RedisClientOptions>({
          ...cacheConfiguration,
          isGlobal: options.isGlobal ? options.isGlobal : false,
        })
      : CacheModule.register({
          ...cacheConfiguration,
          isGlobal: options.isGlobal ? options.isGlobal : false,
        });
  }
}

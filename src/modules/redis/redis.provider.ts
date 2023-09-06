import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export type RedisClient = Redis;

export const RedisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USER,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS,
    });
  },
  provide: 'REDIS_CLIENT',
};

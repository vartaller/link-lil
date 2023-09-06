import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './modules/redis/redis.service';
import { RedisProvider } from './modules/redis/redis.provider';
import { ShrinkerService } from './modules/shrinker/shrinker.service';
import { CrudService } from './modules/crud/crud.service';
import { PrismaService } from './services/prisma.service';
import { LoggerService } from './services/logger.service';

@Module({
  controllers: [AppController],
  providers: [
    LoggerService,
    AppService,
    CrudService,
    PrismaService,
    ShrinkerService,
    RedisProvider,
    RedisService,
  ],
})
export class AppModule {}

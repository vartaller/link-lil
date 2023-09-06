import { Module } from '@nestjs/common';
import { CrudService } from './crud.service';
import { PrismaService } from '../../services/prisma.service';
import { LoggerService } from '../../services/logger.service';

@Module({
  providers: [LoggerService, CrudService, PrismaService],
})
export class CrudModule {}

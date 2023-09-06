import { Module } from '@nestjs/common';
import { ShrinkerService } from './shrinker.service';

@Module({
  controllers: [],
  providers: [ShrinkerService],
})
export class ShrinkerModule {}

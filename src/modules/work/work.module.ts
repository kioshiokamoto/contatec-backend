import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}

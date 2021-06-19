import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';

@Module({
  controllers: [PayController],
  providers: [PayService],
})
export class PayModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Pago from 'src/entity/pago.entity';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pago])],
  controllers: [PayController],
  providers: [PayService],
})
export class PayModule {}

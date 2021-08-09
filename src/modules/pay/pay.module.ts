/* istanbul ignore file */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Pago from 'src/entity/pago.entity';
import Trabajo from 'src/entity/trabajo.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    TypeOrmModule.forFeature([Trabajo]),
  ],
  controllers: [PayController],
  providers: [PayService],
})
export class PayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/pay/service',
      method: RequestMethod.POST,
    });
  }
}

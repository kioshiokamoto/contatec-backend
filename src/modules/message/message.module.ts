/* istanbul ignore file */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Mensaje from 'src/entity/mensaje.entity';
import { UserModule } from '../user/user.module';
import { MessageGateway } from './message.gateway';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import Usuario from 'src/entity/usuario.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Mensaje]),
    TypeOrmModule.forFeature([Usuario]),
  ],
  providers: [MessageGateway, MessageService],
  controllers: [MessageController],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/messages/all',
      method: RequestMethod.ALL,
    });
  }
}

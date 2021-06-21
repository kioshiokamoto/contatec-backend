import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Usuario from 'src/entity/usuario.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/user/reset',
        method: RequestMethod.POST,
      },
      {
        path: '/user/info',
        method: RequestMethod.GET,
      },
      {
        path: '/user/update',
        method: RequestMethod.ALL,
      },
    );
  }
}

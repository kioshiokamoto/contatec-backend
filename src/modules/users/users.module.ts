import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //appli puede tomar varios middllewares
    //Forma 1
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes({ path: 'user', method: RequestMethod.ALL });

    //Forma 2
    consumer.apply(AuthMiddleware).forRoutes(UsersController);

    //Para excluir rutas del middlware
    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude(
    //     { path: 'user', method: RequestMethod.POST },
    //     { path: 'user', method: RequestMethod.GET },
    //     'user/(.*)',
    //   )
    //   .forRoutes(UsersController);
  }
}

/* istanbul ignore file */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from 'src/entity/post.entity';
import Trabajo from 'src/entity/trabajo.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Trabajo]),
  ],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/work/accept-propose',
        method: RequestMethod.POST,
      },
      {
        path: '/work/cancel',
        method: RequestMethod.PATCH,
      },
      {
        path: '/work/update-status',
        method: RequestMethod.PATCH,
      },
    );
  }
}

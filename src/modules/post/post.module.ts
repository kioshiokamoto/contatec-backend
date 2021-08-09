/* istanbul ignore file */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Categoria from 'src/entity/categoria.entity';
import Post from 'src/entity/post.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Categoria]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/post/create',
        method: RequestMethod.ALL,
      },
      {
        path: '/post/update/:id',
        method: RequestMethod.ALL,
      },
      {
        path: '/post/delete/:id',
        method: RequestMethod.ALL,
      },
    );
  }
}

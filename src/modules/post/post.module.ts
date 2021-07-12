/* istanbul ignore file */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import Post from 'src/entity/post.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import Categoria from 'src/entity/categoria.entity';

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
        path: '/post/:id',
        method: RequestMethod.ALL,
      },
    );
  }
}

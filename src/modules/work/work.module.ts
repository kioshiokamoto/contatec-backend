/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from 'src/entity/post.entity';
import Trabajo from 'src/entity/trabajo.entity';
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
export class WorkModule {}

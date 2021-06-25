import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Categoria from 'src/entity/categoria.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoriaActualizarDTO } from './dto/categoria-actualizar.dto';
import { CategoriaDTO } from './dto/categoria.dto';

@ApiTags('Categoría')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  createCategory(@Body() categoryDto: CategoriaDTO) {
    return this.categoryService.createCategory(categoryDto);
  }

  @Get('/categories')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  getCategory(@Param('id') id: number) {
    return this.categoryService.getCategory(id);
  }

  @Patch('/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: CategoriaActualizarDTO,
  ) {
    return this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoriaActualizarDTO } from './dto/categoria-actualizar.dto';
import { CategoriaDTO } from './dto/categoria.dto';

@ApiTags('Categoría')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Creación de categoría' })
  createCategory(@Body() categoryDto: CategoriaDTO) {
    return this.categoryService.createCategory(categoryDto);
  }

  @Get('/categories')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener categoría por id' })
  getCategory(@Param('id') id: number) {
    return this.categoryService.getCategory(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: CategoriaActualizarDTO,
  ) {
    return this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar categoría' })
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}

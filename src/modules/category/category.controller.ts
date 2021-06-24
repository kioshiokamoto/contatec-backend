import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CategoriaDTO } from './dto/categoria.dto';




@ApiTags('Category')
@Controller('category')
export class CategoryController {


    constructor( private readonly categoryService: CategoryService ) {}

    @Post('/create')
    createCategory( @Body() categoryDto: CategoriaDTO ) {
        return this.categoryService.createCategory( categoryDto );
    }

    @Get('categories')
    getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @Get(':id')
    getCategory( @Param('id') id: number ) {
        return this.categoryService.getCategory( id );
    }

    @Put(':id')
    updateCategory( @Param('id') id: number, @Body() categoryDto: CategoriaDTO ) {
        return this.categoryService.updateCategory( id, categoryDto );
    }

    @Delete(':id')
    deleteCategory( @Param('id') id: number ) {
        return this.categoryService.deleteCategory( id );
    }


}







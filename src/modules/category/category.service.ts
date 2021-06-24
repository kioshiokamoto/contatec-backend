import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Categoria from 'src/entity/categoria.entity';
import { CategoriaDTO } from './dto/categoria.dto';



@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Categoria)
        private categoryRepository: Repository<Categoria>,
    ) {}

    
    async createCategory( category: CategoriaDTO ) {
        try {
            
            const { cat_descripcion, cat_nombre } = category;

            const newCategory = this.categoryRepository.create({
                cat_descripcion,
                cat_nombre
            });

            await newCategory.save();

            return {
                message: 'Se creo correctamente la categoria'
            }

        } catch (error) {
            return error;
        }
    }

    async getAllCategories() {
        try {
            return await this.categoryRepository.find();
        } catch (error) {
            return error;
        }
    }

    async getCategory( id: number ) {
        try {
            return await this.categoryRepository.findOne( id );
        } catch (error) {
            return error;
        }
    }

    async updateCategory( id: number, categoryDto: CategoriaDTO ) {
        try {
            const categoria = await this.categoryRepository.findOne( id );

            categoria.cat_descripcion = categoryDto.cat_descripcion;
            categoria.cat_nombre = categoryDto.cat_nombre;

            return await this.categoryRepository.save( categoria );

        } catch (error) {
            return error;
        }
    }

    async deleteCategory( id: number ) {
        try {
            await this.categoryRepository.delete( id );
            return {
                message: 'Se elimino la categoria'
            }
        } catch (error) {
            return error;
        }
    }


}

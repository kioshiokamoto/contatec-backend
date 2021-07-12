/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Categoria from '../../entity/categoria.entity';
import { CategoriaDTO } from './dto/categoria.dto';
import { CategoriaActualizarDTO } from './dto/categoria-actualizar.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
  ) {}

  async createCategory(category: CategoriaDTO) {
    try {
      const { cat_descripcion, cat_nombre } = category;

      const check = await this.categoryRepository.findOne({ cat_nombre });
      if (check) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Categoría ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const newCategory = this.categoryRepository.create({
        cat_descripcion,
        cat_nombre,
      });

      const savedCategory = await newCategory.save();

      return {
        message: 'Se creo correctamente la categoria',
        data: savedCategory,
      };
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

  async getCategory(id: number) {
    try {
      return await this.categoryRepository.findOne(id);
    } catch (error) {
      return error;
    }
  }

  async updateCategory(id: number, categoryDto: CategoriaActualizarDTO) {
    try {
      const { cat_descripcion, cat_nombre } = categoryDto;
      const categoria = await this.categoryRepository.findOne(id);

      if (!categoria) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Categoría no existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (cat_descripcion) {
        categoria.cat_descripcion = cat_descripcion;
      }
      if (cat_nombre) {
        categoria.cat_nombre = cat_nombre;
      }
      categoria.save();
      return {
        message: 'Categoría a sido actualizada',
      };
    } catch (error) {
      return error;
    }
  }

  async deleteCategory(id: number) {
    try {
      const categoria = await this.categoryRepository.findOne(id);

      if (!categoria) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Categoría no existe' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.categoryRepository.delete(id);
      return {
        message: 'Se elimino la categoria',
      };
    } catch (error) {
      return error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Post from 'src/entity/post.entity';
import { CrearPostDTO } from './dtos/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createPost(newpost: CrearPostDTO) {
    try {
      const {
        pst_descripcion,
        pst_idUsuario,
        pst_precioBase,
        pst_imagen_1,
        pst_imagen_2,
        pst_imagen_3,
        pst_imagen_4,
        pst_imagen_5,
      } = newpost;

      const post = this.postRepository.create({
        pst_isActive: true, // La activacion va a estar por defecto
        pst_descripcion,
        pst_idUsuario,
        pst_precioBase,
        pst_imagen_1,
        pst_imagen_2,
        pst_imagen_3,
        pst_imagen_4,
        pst_imagen_5,
      });

      await post.save();

      return {
        message: 'El post se creo correctamente',
      };
    } catch (error) {
      return error;
    }
  }

  async getAllPost() {
    try {
      return await this.postRepository.find();
    } catch (error) {
      return error;
    }
  }

  async getPost(id: number) {
    try {
      return await this.postRepository.findOne(id);
    } catch (error) {
      return error;
    }
  }

  async updatePost(id: number, newpost: CrearPostDTO) {
    try {
      const post = await this.postRepository.findOne(id);

      // No cambio el id de usuario, porq se supone q es el mismo usuario (creo)
      post.pst_descripcion = newpost.pst_descripcion;
      post.pst_imagen_1 = newpost.pst_imagen_1;
      post.pst_imagen_2 = newpost.pst_imagen_2;
      post.pst_imagen_3 = newpost.pst_imagen_3;
      post.pst_imagen_4 = newpost.pst_imagen_4;
      post.pst_imagen_5 = newpost.pst_imagen_5;
      post.pst_precioBase = newpost.pst_precioBase;

      return await this.postRepository.save(post);
    } catch (error) {
      return error;
    }
  }

  // Cambia el estado a habilitado o deshabilitado
  async changeStatus(id: number, status: boolean) {
    try {
      const post = await this.postRepository.findOne(id);

      post.pst_isActive = status;

      await this.postRepository.save(post);

      return {
        message: 'Se cambio el estado del post',
        status,
      };
    } catch (error) {
      return error;
    }
  }

  async deletePost(id: number) {
    try {
      await this.postRepository.delete(id);
      return {
        message: 'Se elimino el post',
      };
    } catch (error) {
      return error;
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import algoliasearch from 'algoliasearch';

import Post from 'src/entity/post.entity';
import { CrearPostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { slugify } from 'src/utils/slugify';
import Post_Categoria from 'src/entity/post_categoria.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Post_Categoria)
    private postCategoryRepository: Repository<Post_Categoria>,
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
        pst_categoria,
      } = newpost;

      const check = await this.postRepository.findOne({ pst_descripcion });
      if (check) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Post ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }

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

      const savedPost = await post.save();

      const post_categoria = this.postCategoryRepository.create({
        pstC_idPost: Number(savedPost.id),
        pstC_idCategoria: Number(pst_categoria),
      });

      const savedPost_categoria = await post_categoria.save();

      console.log(savedPost_categoria);

      //Agregar a algolia
      const algoliaPush = {
        description: slugify(pst_descripcion),
        objectID: savedPost.id,
      };
      const ALGOLIA_APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID;
      const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
      const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

      const client = algoliasearch(
        ALGOLIA_APPLICATION_ID,
        ALGOLIA_ADMIN_API_KEY,
      );

      const index = client.initIndex(ALGOLIA_INDEX_NAME);

      index
        .saveObject(algoliaPush)
        .then((objectID) => {
          console.log({ objectID });
        })
        .catch((error) => {
          console.log(error);
        });

      return {
        message: 'El post se creo correctamente',
        data: savedPost,
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
      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Usuario ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return post;
    } catch (error) {
      return error;
    }
  }

  async updatePost(id: number, newpost: UpdatePostDTO) {
    try {
      const {
        pst_isActive,
        pst_descripcion,
        pst_imagen_1,
        pst_imagen_2,
        pst_imagen_3,
        pst_imagen_4,
        pst_imagen_5,
        pst_precioBase,
      } = newpost;

      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Usuario ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (pst_descripcion) {
        post.pst_descripcion = pst_descripcion;
      }
      if (pst_imagen_1) {
        post.pst_imagen_1 = pst_imagen_1;
      }
      if (pst_imagen_2) {
        post.pst_imagen_2 = pst_imagen_2;
      }
      if (pst_imagen_3) {
        post.pst_imagen_3 = pst_imagen_3;
      }
      if (pst_imagen_4) {
        post.pst_imagen_4 = pst_imagen_4;
      }
      if (pst_imagen_5) {
        post.pst_imagen_5 = pst_imagen_5;
      }
      if (pst_precioBase) {
        post.pst_precioBase = pst_precioBase;
      }
      if (pst_isActive) {
        post.pst_isActive = pst_isActive;
      }

      await post.save();

      return {
        message: 'El post se actualizo correctamente',
      };
    } catch (error) {
      return error;
    }
  }

  async deletePost(id: number) {
    try {
      const check = await this.postRepository.findOne(id);

      if (!check) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Usuario ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.postRepository.delete(id);

      return {
        message: 'Se elimino el post correctamente',
      };
    } catch (error) {
      return error;
    }
  }
}

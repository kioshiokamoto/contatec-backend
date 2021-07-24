/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import algoliasearch from 'algoliasearch';

import Post from '../../entity/post.entity';
import { CrearPostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { slugify } from '../../utils/slugify';
import Categoria from '../../entity/categoria.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
  ) {}

  async createPost(newpost: CrearPostDTO, req: any) {
    try {
      const {
        pst_descripcion,
        pst_precioBase,
        pst_imagen_1,
        pst_imagen_2,
        pst_imagen_3,
        pst_imagen_4,
        pst_imagen_5,
        pst_categoria,
        pst_descripcion_corta,
        pst_descripcion_incluye,
      } = newpost;
      // console.log(req.user .id);
      // console.log(req.user);
      const pst_idUsuario = req.user.id;

      // const check = await this.postRepository.findOne({ pst_descripcion });
      // if (check) {
      //   throw new HttpException(
      //     { status: HttpStatus.BAD_REQUEST, error: 'Post ya existe' },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      const post = this.postRepository.create({
        pst_descripcion,
        pst_precioBase,
        pst_imagen_1,
        pst_imagen_2,
        pst_imagen_3,
        pst_imagen_4,
        pst_imagen_5,
        pst_descripcion_corta,
        pst_descripcion_incluye,
        pstUsuarioId: pst_idUsuario,
        pstCategoriaId: pst_categoria as unknown as Categoria,
      });

      const savedPost = await post.save();

      const { cat_nombre: categoriaAlgolia } =
        await this.categoryRepository.findOne({
          id: Number(pst_categoria),
        });

      //Agregar a algolia
      const algoliaPush = {
        description: slugify(pst_descripcion),
        objectID: savedPost.id,
        category: categoriaAlgolia,
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
        data: {
          ...savedPost,
          pst_category: categoriaAlgolia,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getAllPost() {
    try {
      return await this.postRepository.find({
        relations: ['pstUsuarioId', 'pstCategoriaId'],
      });
    } catch (error) {
      return error;
    }
  }

  async getPost(id: number) {
    try {
      const post = await this.postRepository.findOne(id, {
        relations: ['pstUsuarioId', 'pstCategoriaId'],
      });

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

  async updatePost(id: number, newpost: UpdatePostDTO, req) {
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
        pst_categoria,
        pst_descripcion_corta,
        pst_descripcion_incluye,
      } = newpost;

      const post = await this.postRepository.findOne(id, {
        relations: ['pstUsuarioId', 'pstCategoriaId'],
      });

      if (!post) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Usuario ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      // console.log(id);
      if (post.pstUsuarioId.id !== req.user.id) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Post no pertenece a usuario',
          },
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
      if (pst_categoria) {
        post.pstCategoriaId = pst_categoria as unknown as Categoria;
      }
      if (pst_descripcion_corta) {
        post.pst_descripcion_corta = pst_descripcion_corta;
      }
      if (pst_descripcion_incluye) {
        post.pst_descripcion_incluye = pst_descripcion_incluye;
      }
      const postSaved = await post.save();
      console.log(postSaved);

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

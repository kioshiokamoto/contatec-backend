import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import algoliasearch from 'algoliasearch';
import { getManager, getRepository, Repository } from 'typeorm';
import Categoria from '../../entity/categoria.entity';
import Post from '../../entity/post.entity';
import { slugify } from '../../utils/slugify';
import { CrearPostDTO, SearchPostDto, UpdatePostDTO } from './dtos';

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
        pst_nombre,
      } = newpost;
      const array_pst_descripcion_incluye = pst_descripcion_incluye.join(',');
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
        pst_nombre,
        pst_descripcion_incluye: array_pst_descripcion_incluye,
        pstUsuarioId: pst_idUsuario,
        pstCategoriaId: pst_categoria as unknown as Categoria,
      });

      const savedPost = await post.save();

      // const { cat_nombre: categoriaAlgolia } =
      //   await this.categoryRepository.findOne({
      //     id: Number(pst_categoria),
      //   });

      //Agregar a algolia
      const algoliaPush = {
        description: slugify(pst_nombre),
        objectID: savedPost.id,
        category_id: pst_categoria,
      };
      const ALGOLIA_APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID;
      const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
      const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

      const client = algoliasearch(
        ALGOLIA_APPLICATION_ID,
        ALGOLIA_ADMIN_API_KEY,
      );

      const index = client.initIndex(ALGOLIA_INDEX_NAME);
      const algoliasave = await index.saveObject(algoliaPush);
      console.log(algoliasave);

      const postRelations = await this.postRepository.findOne(
        { id: savedPost.id },
        { relations: ['pstCategoriaId', 'pstUsuarioId'] },
      );

      return {
        message: 'El post se creo correctamente',
        data: {
          ...postRelations,
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

  async getExplorePosts() {
    try {
      //Agregar where con contador de reviews
      const recommendedPosts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.pstCategoriaId', 'categoria')
        .leftJoinAndSelect('post.pstUsuarioId', 'usuario')
        .orderBy('post.createdAt', 'DESC')
        .limit(5)
        .getMany();
      //Finalizada
      const latestPosts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.pstCategoriaId', 'categoria')
        .leftJoinAndSelect('post.pstUsuarioId', 'usuario')
        .orderBy('post.createdAt', 'DESC')
        .limit(5)
        .getMany();
      // Retorrna posts recientemente actualizados
      const interestingPosts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.pstCategoriaId', 'categoria')
        .leftJoinAndSelect('post.pstUsuarioId', 'usuario')
        .orderBy('post.updatedAt', 'DESC')
        .limit(5)
        .getMany();
      return {
        recommendedPosts,
        latestPosts,
        interestingPosts,
      };
    } catch (error) {
      return error;
    }
  }
  async getPost(id: number) {
    try {
      const post = await this.postRepository.findOne(
        { id },
        {
          relations: ['pstUsuarioId', 'pstCategoriaId'],
        },
      );
      if (!post) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'No se encontró post' },
          HttpStatus.NOT_FOUND,
        );
      }

      const entityManager = getManager();
      const reviews = await entityManager.query(`
        SELECT CONCAT(U.us_nombre,' ',U.us_apellido) as name,
            U.avatar as avatar,
            R.rw_score as score,
            R.rw_comentario as comentary
        FROM review R
            INNER JOIN post P ON(R.id_post=P.id)
            INNER JOIN usuario U ON(U.id=R.id_usuario)
        WHERE P.id=${id};
      `);
      const scoreReviews = await entityManager.query(`
        SELECT ROUND(AVG(R.rw_score),1) score_average,
            COUNT(IF(R.rw_score = 1 , 1, null)) AS score_one,
            COUNT(IF(R.rw_score = 2 , 1, null)) AS score_two,
            COUNT(IF(R.rw_score = 3 , 1, null)) AS score_three,
            COUNT(IF(R.rw_score = 4 , 1, null)) AS score_four,
            COUNT(IF(R.rw_score = 5 , 1, null)) AS score_five
        FROM review R
            INNER JOIN post P ON(R.id_post=P.id)
        WHERE P.id=295
        GROUP BY R.id_post;
      `);
      return {
        post,
        reviews,
        scoreReviews,
      };
    } catch (error) {
      return error;
    }
  }

  async searchPost(searchDto: SearchPostDto) {
    try {
      const { categoria_post, nombre_post } = searchDto;

      if (!nombre_post && !categoria_post) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Petición inválida' },
          HttpStatus.BAD_REQUEST,
        );
      }
      let post: any = {};
      //Primero se busca por nombre;

      if (nombre_post) {
        post = await getRepository(Post)
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.pstCategoriaId', 'categoria')
          .where('post.pst_nombre like :nombre', { nombre: `%${nombre_post}%` })
          .getOne();

        if (post) {
          return {
            message: 'Se encontró post',
            data: {
              idPost: post.id,
              idCategoria: post.pstCategoriaId.id,
            },
          };
        }
      }
      //Si no encuentra por nombre busca por categoria
      if (categoria_post) {
        post = await getRepository(Post)
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.pstCategoriaId', 'categoria')
          .where('categoria.cat_nombre like :nombre', {
            nombre: `%${categoria_post}%`,
          })
          .getOne();

        if (post) {
          return {
            message: 'Se encontró post',
            data: {
              idPost: post.id,
              idCategoria: post.pstCategoriaId.id,
            },
          };
        }
      }
      // Si no encuentra por categoria retorna error
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No se encontró post o categoría',
        },
        HttpStatus.NOT_FOUND,
      );
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
        pst_nombre,
      } = newpost;

      const array_pst_descripcion_incluye = pst_descripcion_incluye.join(',');
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
        post.pst_descripcion_incluye = array_pst_descripcion_incluye;
      }
      if (pst_nombre) {
        post.pst_nombre = pst_nombre;
      }
      const postSaved = await post.save();

      const postRelations = await this.postRepository.findOne(
        { id: postSaved.id },
        { relations: ['pstCategoriaId', 'pstUsuarioId'] },
      );

      return {
        message: 'El post se actualizo correctamente',
        data: {
          ...postRelations,
        },
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

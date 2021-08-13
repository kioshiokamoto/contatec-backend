import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as algoliasearch from 'algoliasearch';
import Categoria from '../../entity/categoria.entity';
import Post from '../../entity/post.entity';
import Usuario from '../../entity/usuario.entity';
import { PostService } from './post.service';
import { CrearPostDTO, SearchPostDto, UpdatePostDTO } from './dtos';
import { HttpException } from '@nestjs/common';
import * as typeorm from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<Post>, jest.Mock>
>;

describe('CategoryService', () => {
  let service: PostService;
  let postRepository: MockRepository<Post>;
  const postgetOne = new Post({});
  postgetOne.id = 11;
  postgetOne.pstCategoriaId = new Categoria({
    id: 10,
  });
  postgetOne.pstUsuarioId = new Usuario({
    id: 10,
  });
  const query = {
    where: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Categoria),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<PostService>(PostService);
    postRepository = module.get(getRepositoryToken(Post));
  });
  it('be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    const post = new CrearPostDTO();
    post.pst_descripcion_incluye = [];
    post.pst_nombre = 'name';
    post.pst_categoria = 1;

    const savepost = new Post({
      pstCategoriaId: new Categoria({}),
    });
    savepost.id = 100;

    const req = {
      user: {
        id: 1,
      },
    };
    it('createPost', async () => {
      postRepository.create.mockReturnValue({
        save: jest.fn(() => savepost),
      });
      const postRelations = new Post({});
      postRepository.findOne.mockReturnValue(postRelations);
      const res = await service.createPost(post, req);
      expect(res).toEqual({
        message: 'El post se creo correctamente',
        data: {
          ...postRelations,
        },
      });
    });
    it('Should be throw an error', async () => {
      postRepository.create.mockReturnValue({
        save: jest.fn(() => {
          throw new Error('No se pudo guardar el post');
        }),
      });
      const res = await service.createPost(post, req);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('No se pudo guardar el post');
    });
    it('Algolia throws an error', async () => {
      postRepository.create.mockReturnValue({
        save: jest.fn(() => savepost),
      });
      const postRelations = new Post({});
      postRepository.findOne.mockReturnValue(postRelations);
      jest.spyOn(algoliasearch, 'default').mockImplementation(() => {
        const original = jest.requireActual('algoliasearch');
        return {
          ...original,
          initIndex: jest.fn().mockReturnValue({
            saveObject: jest
              .fn()
              .mockRejectedValue(new Error('Error con algolia')),
          }),
        };
      });
      const res = await service.createPost(post, req);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Error con algolia');
    });
  });
  describe('getAllPost', () => {
    it('getAllPost success', async () => {
      postRepository.find.mockReturnValue([new Post({})]);
      const res = await service.getAllPost();
      expect(res).toEqual([expect.any(Post)]);
    });
    it('Should be throw an error', async () => {
      postRepository.find.mockRejectedValue(
        new Error('No se pudo obtener todos los posts'),
      );
      const res = await service.getAllPost();
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('No se pudo obtener todos los posts');
    });
  });
  describe('getExplorePosts', () => {
    it('getExplorePosts success', async () => {
      query['getMany'] = jest.fn().mockReturnValue([new Post({})]);
      postRepository.createQueryBuilder.mockReturnValue(query);
      const res = await service.getExplorePosts();
      expect(res).toEqual({
        recommendedPosts: [expect.any(Post)],
        latestPosts: [expect.any(Post)],
        interestingPosts: [expect.any(Post)],
      });
    });
    it('getExplorePosts fail', async () => {
      query['getMany'] = jest
        .fn()
        .mockRejectedValue(new Error('Error al extraer posts'));
      postRepository.createQueryBuilder.mockReturnValue(query);
      const res = await service.getExplorePosts();
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Error al extraer posts');
    });
  });
  describe('getPost', () => {
    it('getPost success', async () => {
      postRepository.findOne.mockReturnValue(new Post({}));
      const res = await service.getPost(1);
      expect(res).toEqual(expect.any(Post));
    });
    it('getPost fail with undefined value', async () => {
      postRepository.findOne.mockReturnValue(undefined);
      const res = await service.getPost(1);
      expect(res).toBeInstanceOf(HttpException);
      expect(res.response).toEqual({
        status: 404,
        error: 'No se encontró post',
      });
    });
    it('getPost fail', async () => {
      postRepository.findOne.mockRejectedValue(
        new Error('Error al extraer un post'),
      );
      const res = await service.getPost(1);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Error al extraer un post');
    });
  });
  describe('searchPost', () => {
    const searchPost = new SearchPostDto();
    const searchPost2 = new SearchPostDto();
    searchPost2.categoria_post = 'category';
    searchPost2.nombre_post = 'name';
    it('Petición inválida', async () => {
      const res = await service.searchPost(searchPost);
      expect(res).toBeInstanceOf(HttpException);
      expect(res.response).toEqual({
        status: 400,
        error: 'Petición inválida',
      });
    });
    it('Only nombre_post exists', async () => {
      searchPost.nombre_post = 'name';
      query['getOne'] = jest.fn().mockReturnValue(postgetOne);
      jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockReturnValue(query),
        };
      });
      const res = await service.searchPost(searchPost);
      expect(res).toEqual({
        message: 'Se encontró post',
        data: {
          idPost: postgetOne.id,
          idCategoria: postgetOne.pstCategoriaId.id,
        },
      });
    });
    it('Only categoria_post exists', async () => {
      searchPost.nombre_post = undefined;
      searchPost.categoria_post = 'category';
      query['getOne'] = jest.fn().mockReturnValue(postgetOne);
      const res = await service.searchPost(searchPost);
      expect(res).toEqual({
        message: 'Se encontró post',
        data: {
          idPost: postgetOne.id,
          idCategoria: postgetOne.pstCategoriaId.id,
        },
      });
    });
    it('Post does not exists', async () => {
      searchPost.nombre_post = 'name';
      query['getOne'] = jest.fn().mockReturnValue(undefined);
      const res = await service.searchPost(searchPost);
      expect(res).toBeInstanceOf(HttpException);
      expect(res.response).toEqual({
        status: 404,
        error: 'No se encontró post o categoría',
      });
    });
  });
  describe('updatePost', () => {
    const updatePost = new UpdatePostDTO();
    updatePost.pst_isActive = true;
    updatePost.pst_descripcion = 'description';
    updatePost.pst_nombre = 'name';
    updatePost.pst_descripcion_corta = 'short';
    updatePost.pst_descripcion_incluye = ['one', 'two'];
    updatePost.pst_precioBase = 350;
    updatePost.pst_categoria = 12;
    updatePost.pst_imagen_1 = 'link1';
    updatePost.pst_imagen_2 = 'link2';
    updatePost.pst_imagen_3 = 'link3';
    updatePost.pst_imagen_4 = 'link4';
    updatePost.pst_imagen_5 = 'link5';

    const req = {
      user: {
        id: 15,
        name: 'name',
      },
    };
    it('Petición inválida', async () => {
      postRepository.findOne.mockResolvedValue(undefined);
      const res = await service.updatePost(1, updatePost, req);
      expect(res).toBeInstanceOf(HttpException);
      expect(res.response).toEqual({
        status: 400,
        error: 'Usuario ya existe',
      });
    });
    it('Post no pertenece a usuario', async () => {
      postRepository.findOne.mockResolvedValue(postgetOne);
      const res = await service.updatePost(1, updatePost, req);
      expect(res).toBeInstanceOf(HttpException);
      expect(res.response).toEqual({
        status: 400,
        error: 'Post no pertenece a usuario',
      });
    });
    it('Update post was successfully', async () => {
      const reqYes = {
        user: {
          id: 10,
          name: 'name',
        },
      };
      const postyes = new Post({
        save: jest.fn().mockReturnValue({
          id: 66,
        }),
      });
      postyes.pstUsuarioId = new Usuario({
        id: 10,
      });
      postRepository.findOne.mockResolvedValue(postyes);
      const res = await service.updatePost(1, updatePost, reqYes);
      expect(res).toEqual({
        message: 'El post se actualizo correctamente',
        data: {
          ...postyes,
        },
      });
    });
    it('Update post was successfully without any changes', async () => {
      const reqYes = {
        user: {
          id: 10,
          name: 'name',
        },
      };
      const postyes = new Post({
        save: jest.fn().mockReturnValue({
          id: 66,
        }),
      });
      postyes.pstUsuarioId = new Usuario({
        id: 10,
      });
      postRepository.findOne.mockResolvedValue(postyes);
      const updatePost2 = new UpdatePostDTO();
      updatePost2.pst_descripcion_incluye = [];
      const res = await service.updatePost(1, updatePost2, reqYes);
      expect(res).toEqual({
        message: 'El post se actualizo correctamente',
        data: {
          ...postyes,
        },
      });
    });
  });
  describe('deletePost', () => {
    it('Usuario ya existe', async () => {
      postRepository.findOne.mockResolvedValue(undefined);
      const res = await service.deletePost(1);
      expect(res).toBeInstanceOf(HttpException);
      expect(res.response).toEqual({
        status: 400,
        error: 'Usuario ya existe',
      });
    });
    it('Post no pertenece a usuario', async () => {
      postRepository.findOne.mockResolvedValue(new Post({}));
      postRepository.delete.mockResolvedValue({});
      const res = await service.deletePost(1);
      expect(res.message).toEqual('Se elimino el post correctamente');
    });
  });
});

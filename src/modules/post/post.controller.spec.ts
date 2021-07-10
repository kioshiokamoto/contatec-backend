import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('Post Controller', () => {
  let postController: PostController;
  const mockPostService = {
    createPost: jest.fn().mockImplementation((dto) => {
      return 'El post se creo correctamente';
    }),
    getAllPost: jest.fn().mockImplementation((dto) => {
      return [];
    }),
    getPost: jest.fn().mockImplementation((dto) => {
      return {};
    }),
    updatePost: jest.fn().mockImplementation((dto) => {
      return 'El post se actualizo correctamente';
    }),
    deletePost: jest.fn().mockImplementation((dto) => {
      return 'Se elimino el post correctamente';
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .compile();
    postController = moduleRef.get<PostController>(PostController);
  });

  it('Usuario autenticado debe poder crear post', () => {
    const req = mocks.createRequest();
    const createPostDto = {
      pst_descripcion: 'Test',
      pst_categoria: 1,
      pst_precioBase: 10,
      pst_isActive: true,
      pst_imagen_1: '',
      pst_imagen_2: '',
      pst_imagen_3: '',
      pst_imagen_4: '',
      pst_imagen_5: '',
    };
    expect(postController.createPost(createPostDto, req)).toEqual(
      'El post se creo correctamente',
    );
    expect(mockPostService.createPost).toHaveBeenCalled();
  });
  it('Usuario sin autenticar debe poder acceder a todos los posts', () => {
    expect(postController.getAllPost()).toEqual([]);
    expect(mockPostService.createPost).toHaveBeenCalled();
  });
  it('Usuario debe poder obtener un solo post', () => {
    const param = 1;
    expect(postController.getPost(param)).toEqual({});
    expect(mockPostService.getPost).toHaveBeenCalled();
  });
  it('Usuario autenticado debe poder actualizar post', () => {
    const res = mocks.createRequest();
    const param = 1;
    const updatePostDto = {
      pst_descripcion: 'Test',
      pst_categoria: 1,
      pst_precioBase: 10,
      pst_isActive: true,
      pst_imagen_1: '',
      pst_imagen_2: '',
      pst_imagen_3: '',
      pst_imagen_4: '',
      pst_imagen_5: '',
    };
    expect(postController.updatePost(param, updatePostDto, res)).toEqual(
      'El post se actualizo correctamente',
    );
    expect(mockPostService.updatePost).toHaveBeenCalled();
  });
  it('Usuario autenticado debe poder eliminar su post', () => {
    const param = 1;
    expect(postController.deletePost(param)).toEqual(
      'Se elimino el post correctamente',
    );
    expect(mockPostService.deletePost).toHaveBeenCalled();
  });
});

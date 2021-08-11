import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import Categoria from '../../entity/categoria.entity';
import { CategoryService } from './category.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<Categoria>, jest.Mock>
>;

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: MockRepository<Categoria>;

  const number = Math.floor(Math.random() * 100);
  const createCategoryArgs = {
    id: number,
    cat_nombre: 'categoria',
    cat_descripcion: 'descripcion',
    post: [],
    save: jest.fn(() => new Object()),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Categoria), // User Entity의 Repository Token
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(Categoria));
  });

  it('be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('Falla si el producto existe', async () => {
      categoryRepository.findOne.mockResolvedValue({ cat_nombre: 'categoria' });
      const result = await service.createCategory(createCategoryArgs);
      expect(result.status).toEqual(400);
    });
    it('Crea el nuevo producto', async () => {
      categoryRepository.findOne.mockResolvedValue(undefined);
      categoryRepository.create.mockReturnValue(createCategoryArgs);
      const result = await service.createCategory(createCategoryArgs);
      expect(result).toEqual({
        message: 'Se creo correctamente la categoria',
        data: expect.any(Object),
      });
    });
  });
  describe('getAllCategories', () => {
    const listCategories = [createCategoryArgs, {}];
    it('Falla si ocurre un error al retornar las categorias', async () => {
      categoryRepository.find.mockResolvedValue(Promise.reject(new Error()));
      const result = await service.getAllCategories();
      expect(result).toBeInstanceOf(Error);
    });
    it('Retorna el producto', async () => {
      categoryRepository.find.mockResolvedValue(listCategories);
      const result = await service.getAllCategories();
      expect(result).toEqual(listCategories);
    });
  });
  describe('getCategory', () => {
    it('Falla si ocurre un error al retornar las categorias', async () => {
      categoryRepository.findOne.mockResolvedValue(Promise.reject(new Error()));
      const result = await service.getCategory(number);
      expect(result).toBeInstanceOf(Error);
    });
    it('Retorna el producto', async () => {
      categoryRepository.findOne.mockResolvedValue(createCategoryArgs);
      const result = await service.getCategory(number);
      expect(result).toEqual(createCategoryArgs);
    });
  });
  describe('updateCategory', () => {
    it('Falla si no existe la categoría', async () => {
      categoryRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updateCategory(number, createCategoryArgs);
      expect(result).toEqual(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Categoría no existe' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    it('Actualiza el producto', async () => {
      categoryRepository.findOne.mockResolvedValue(createCategoryArgs);
      const result = await service.updateCategory(number, createCategoryArgs);
      expect(result).toEqual({
        message: 'Categoría a sido actualizada',
      });
    });
  });
  describe('deleteCategory', () => {
    it('Falla si no existe la categoría', async () => {
      categoryRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deleteCategory(number);
      expect(result).toEqual(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Categoría no existe' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    it('Actualiza el producto', async () => {
      categoryRepository.findOne.mockResolvedValue(createCategoryArgs);
      categoryRepository.delete.mockResolvedValue(undefined);
      const result = await service.deleteCategory(number);
      expect(result).toEqual({
        message: 'Se elimino la categoria',
      });
    });
  });
});

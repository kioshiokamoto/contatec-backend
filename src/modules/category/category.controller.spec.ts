import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
describe('Category Controller', () => {
  let categoryController: CategoryController;
  const mockCategorySevice = {
    createCategory: jest.fn().mockImplementation((dto) => {
      return 'Se creo correctamente la categoria';
    }),
    getAllCategories: jest.fn().mockImplementation((dto) => {
      return [];
    }),
    getCategory: jest.fn().mockImplementation((dto) => {
      return {};
    }),
    updateCategory: jest.fn().mockImplementation((dto) => {
      return 'Categoría a sido actualizada';
    }),
    deleteCategory: jest.fn().mockImplementation((dto) => {
      return 'Se elimino la categoria';
    }),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    })
      .overrideProvider(CategoryService)
      .useValue(mockCategorySevice)
      .compile();
    categoryController = moduleRef.get<CategoryController>(CategoryController);
  });
  it('Se debe poder crear categoria', () => {
    const postCategoryDto = {
      cat_nombre: 'test',
      cat_descripcion: 'desc',
    };
    expect(categoryController.createCategory(postCategoryDto)).toEqual(
      'Se creo correctamente la categoria',
    );
    expect(mockCategorySevice.createCategory).toHaveBeenCalled();
  });
  it('Se debe poder obtener todas las categorias', () => {
    expect(categoryController.getAllCategories()).toEqual([]);
    expect(mockCategorySevice.getAllCategories).toHaveBeenCalled();
  });
  it('Se debe poder obtener una sola categoria', () => {
    const param = 1;
    expect(categoryController.getCategory(param)).toEqual({});
    expect(mockCategorySevice.getCategory).toHaveBeenCalled();
  });
  it('Se debe poder actualizar categoria', () => {
    const param = 1;
    const updateCategoryDto = {
      cat_nombre: 'test2',
      cat_descripcion: 'desc2',
    };
    expect(categoryController.updateCategory(param, updateCategoryDto)).toEqual(
      'Categoría a sido actualizada',
    );
    expect(mockCategorySevice.updateCategory).toHaveBeenCalled();
  });
  it('Se debe poder eliminar categoria', () => {
    const param = 1;
    expect(categoryController.deleteCategory(param)).toEqual(
      'Se elimino la categoria',
    );
    expect(mockCategorySevice.deleteCategory).toHaveBeenCalled();
  });
});

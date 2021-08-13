import { Test } from '@nestjs/testing';
import Post from '../../entity/post.entity';
import Trabajo from '../../entity/trabajo.entity';
import { WorkService } from './work.service';
import { AcceptPropose, UpdateWork } from './dtos';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './enum/estado';

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
  let service: WorkService;
  let workRepository: MockRepository<Trabajo>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkService,
        {
          provide: getRepositoryToken(Trabajo),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<WorkService>(WorkService);
    workRepository = module.get(getRepositoryToken(Trabajo));
  });
  it('be defined', () => {
    expect(service).toBeDefined();
  });
  describe('acceptPropose', () => {
    const propose = new AcceptPropose();
    propose.id_mensaje = 1;
    it('acceptPropose works well', async () => {
      workRepository.create.mockReturnValue(
        new Trabajo({
          id: 1,
          save: jest.fn().mockReturnThis(),
        }),
      );
      workRepository.findOne.mockReturnValue(new Trabajo({}));
      const res = await service.acceptPropose(propose);
      expect(res).toEqual({
        message: 'Se aceptó propuesta correctamente',
        data: expect.any(Object),
      });
    });
    it('Should be fail', async () => {
      workRepository.create.mockReturnValue(
        new Trabajo({
          id: 1,
          save: jest.fn().mockRejectedValue(new Error('Unable to create work')),
        }),
      );
      const res = await service.acceptPropose(propose);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toEqual('Unable to create work');
    });
  });
  describe('cancelWork', () => {
    it('Work with specified id does not exists', async () => {
      workRepository.findOne.mockReturnValue(undefined);
      const res = await service.cancelWork(1);
      expect(res).toBeInstanceOf(Error);
      expect(res.response).toEqual({ status: 400, error: 'Trabajo no existe' });
    });
    it('Work with status "En proceso', async () => {
      workRepository.findOne.mockReturnValue(
        new Trabajo({ trb_estado: 'En proceso' as Estado }),
      );
      const res = await service.cancelWork(1);
      expect(res).toBeInstanceOf(Error);
      expect(res.response).toEqual({
        status: 400,
        error: 'No es posible cancelar trabajo',
      });
    });
    it('Should be works well', async () => {
      workRepository.findOne.mockReturnValue(
        new Trabajo({ trb_estado: 'Contratado' as Estado, save: jest.fn() }),
      );
      const res = await service.cancelWork(1);
      expect(res.message).toEqual('Se canceló el trabajo correctamente');
    });
  });
  describe('updateStatus', () => {
    const update = new UpdateWork();
    it('Should be throw an error', async () => {
      workRepository.findOne.mockReturnValue(undefined);
      const res = await service.updateStatus(1, update);
      expect(res).toBeInstanceOf(Error);
      expect(res.response).toEqual({ status: 400, error: 'Trabajo no existe' });
    });
    it('Update without arguments was successful', async () => {
      workRepository.findOne.mockReturnValue({
        ...update,
        save: jest.fn(),
      });
      const res = await service.updateStatus(1, update);
      expect(res).toEqual({
        message: 'Se actualizó estado de trabajo correctamente ',
        data: expect.any(Object),
      });
    });
    it('Update with arguments was successful', async () => {
      update.id_pago = 1;
      update.trb_cancelado = true;
      update.trb_estado = 'Finalizado' as Estado;
      workRepository.findOne.mockReturnValue({
        ...update,
        save: jest.fn(),
      });
      const res = await service.updateStatus(1, update);
      expect(res).toEqual({
        message: 'Se actualizó estado de trabajo correctamente ',
        data: expect.any(Object),
      });
    });
  });
});

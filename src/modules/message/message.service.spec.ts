import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as typeorm from 'typeorm';
import { Repository } from 'typeorm';
import { createSandbox, SinonSandbox, createStubInstance } from 'sinon';

import { MessageService } from './message.service';
import Usuario from '../../entity/usuario.entity';
import Mensaje from '../../entity/mensaje.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<Mensaje>, jest.Mock>
>;
class Mock {
  sandbox: SinonSandbox;
  constructor(method: string | any, fakeData: any, args?: any) {
    this.sandbox = createSandbox();
    if (args) {
      this.sandbox.stub(typeorm, method).withArgs(args).returns(fakeData);
    } else {
      this.sandbox.stub(typeorm, method).returns(fakeData);
    }
  }
  close() {
    this.sandbox.restore();
  }
}

describe('MessageService', () => {
  let service: MessageService;
  let messageRepository: MockRepository<Mensaje>;
  let userRepository: MockRepository<Usuario>;
  let mock: Mock;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Mensaje),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<MessageService>(MessageService);
    userRepository = module.get(getRepositoryToken(Usuario));
  });
  it('Debería ser definido', () => {
    expect(service).toBeDefined();
  });
  it('Debería retornar todos los mensajes', async () => {
    const req = {
      user: {
        id: 1,
        name: 'any',
      },
    };
    const fakeManager = createStubInstance(typeorm.EntityManager);
    fakeManager.query.resolves([]);
    mock = new Mock('getManager', fakeManager);
    const res = await service.getAllMessages(req);
    expect(res).toStrictEqual([]);
    afterEach(() => mock.close());
  });
  it('Debería retornar todos los mensajes de un usuario de una persona seleccionada', async () => {
    const req = {
      user: {
        id: 1,
        name: 'any',
      },
    };
    const fakeManager = createStubInstance(typeorm.EntityManager);
    fakeManager.query.resolves({});
    userRepository.findOne.mockReturnValue(
      new Usuario({
        us_correo: 'any@example.com',
        us_apellido: 'lastname',
        avatar: 'avatar11.com',
      }),
    );
    const res = await service.getAllMessagesWith(req, 11);
    expect(res).toBeInstanceOf(Object);
  });
});

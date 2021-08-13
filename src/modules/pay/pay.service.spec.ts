import { Test } from '@nestjs/testing';
import { PayService } from './pay.service';
import Pago from '../../entity/pago.entity';
import Trabajo from '../../entity/trabajo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayServiceNow } from './dtos/pay-service-now.dto';
import * as Culqi from 'culqi-node';
import * as dotenv from 'dotenv';
dotenv.config();

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<Pago>, jest.Mock>
>;

describe('UsersService', () => {
  let service: PayService;
  let payRepository: MockRepository<Pago>;
  let workRepository: MockRepository<Trabajo>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PayService,
        {
          provide: getRepositoryToken(Pago), // User Entity의 Repository Token
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Trabajo),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<PayService>(PayService);
    payRepository = module.get(getRepositoryToken(Pago));
    workRepository = module.get(getRepositoryToken(Trabajo));
  });
  it('be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createAccount', () => {
    const culqi = new Culqi({
      privateKey: process.env.SK_CULQI,
      publicKey: process.env.PK_CULQI,
      pciCompliant: true,
    });
    const pago = new PayServiceNow();
    pago.pgo_apellido = 'Hendricks';
    pago.pgo_correo = 'usuario1@domain.com';
    pago.pgo_direccion = 'direction';
    pago.pgo_dni = '12348765';
    pago.pgo_monto = 550;
    pago.pgo_nombre = 'Richard';
    pago.pgo_telefono = '505434800';
    pago.pgo_trabajoId = 55;
    const work = new Trabajo({
      save: jest.fn(),
    });
    const req = {
      user: {
        id: 12,
        name: 'name',
      },
    };
    const payFunction = (data: any) => {
      data['save'] = () => {
        data['id'] = 55;
        return data;
      };
      return data;
    };
    it('PayService', async () => {
      const token = culqi.tokens.createToken({
        card_number: '371212121212122',
        cvv: '2841',
        expiration_month: '11',
        expiration_year: '2025',
        email: 'usuario1@domain.com',
      });
      pago.pgo_token_culqi = (await token).id;
      payRepository.create.mockImplementation(payFunction);
      workRepository.findOne.mockResolvedValue(work);
      const result = await service.payServiceNow(pago, req);
      expect(result.message).toEqual('El pago se realizo correctamente');
    });
    it('Error durante la compra', async () => {
      const token = culqi.tokens.createToken({
        card_number: '4000030000000009',
        cvv: '836',
        expiration_month: '08',
        expiration_year: '2025',
        email: 'email@domain.com',
      });
      pago.pgo_token_culqi = (await token).id;
      payRepository.create.mockImplementation(payFunction);
      workRepository.findOne.mockResolvedValue(work);
      const result = await service.payServiceNow(pago, req);
      expect(result.merchant_message).toEqual(
        'Tarjeta perdida. La tarjeta fue bloqueada y reportada al banco emisor como una tarjeta perdida.',
      );
    });
  });
});

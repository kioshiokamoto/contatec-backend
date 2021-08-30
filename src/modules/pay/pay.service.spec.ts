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

describe('PayService', () => {
  let service: PayService;
  let payRepository: MockRepository<Pago>;
  let workRepository: MockRepository<Trabajo>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PayService,
        {
          provide: getRepositoryToken(Pago),
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
  it('Debería ser definido', () => {
    expect(service).toBeDefined();
  });
  describe('función payServiceNow', () => {
    const culqi = new Culqi({
      privateKey: process.env.SK_CULQI,
      publicKey: process.env.PK_CULQI,
      pciCompliant: true,
    });
    const pago = new PayServiceNow();
    pago.pgo_apellido = 'Hendricks';
    pago.pgo_correo = 'usuario1@example.com';
    pago.pgo_direccion = 'direction';
    pago.pgo_dni = '12348765';
    pago.pgo_monto = 550;
    pago.pgo_nombre = 'Richard';
    pago.pgo_telefono = '505434800';
    pago.pgo_trabajoId = 56;
    const work = new Trabajo({
      save: jest.fn(),
    });
    const req = {
      user: {
        id: 12,
        name: 'nombre',
      },
    };
    const payFunction = (data: any) => {
      data['save'] = () => {
        data['id'] = 56;
        return data;
      };
      return data;
    };
    it('El pago se realiza correctamente', async () => {
      const token = culqi.tokens.createToken({
        card_number: '5111111111111118',
        cvv: '039',
        expiration_month: '06',
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
        'La tarjeta del cliente ha excedido el numero maximo de intentos diario.',
      );
    });
  });
});

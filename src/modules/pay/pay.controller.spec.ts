import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
describe('Pay controller', () => {
  let payController: PayController;
  const mockPayService = {
    payServiceNow: jest.fn().mockImplementation((dto) => {
      return 'El pago se realizo correctamente';
    }),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PayController],
      providers: [PayService],
    })
      .overrideProvider(PayService)
      .useValue(mockPayService)
      .compile();

    payController = moduleRef.get<PayController>(PayController);
  });

  it('Usuario debe poder realizar pago', () => {
    const payDto = {
      pgo_nombre: 'Name',
      pgo_apellido: 'Last Name',
      pgo_dni: '74444811',
      pgo_direccion: 'Av unive 123',
      pgo_correo: 'mock@mail.pe',
      pgo_monto: 123.0,
      pgo_telefono: '970794003',
      pgo_token_culqi: 'slkj1l0.asd1ashdf',
    };
    expect(payController.payServiceNow(payDto)).toEqual(
      'El pago se realizo correctamente',
    );
  });
});

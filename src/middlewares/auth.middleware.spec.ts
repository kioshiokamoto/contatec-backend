/* istanbul ignore file */
import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let service: AuthMiddleware;
  const req = mocks.createRequest();
  const res = mocks.createResponse();
  it('Se debe definir el middleware', () => {
    expect(new AuthMiddleware()).toBeDefined();
  });
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthMiddleware],
    }).compile();
    service = moduleRef.get(AuthMiddleware);
  });
  it('Debe matchear con snapshot', () => {
    const demo = service.use(req, res, () => {
      return;
    });
    expect(service.use).toMatchSnapshot();
  });
  it('Debe validar si el token existe', () => {
    req.headers = {
      authorization: 'auth',
    };
    expect(
      service.use(req, res, () => {
        return;
      }).statusCode,
    ).toEqual(400);
  });
  it('Se debe validar si el token es correcto', () => {
    req.headers = {
      authorization: `Bearer 1`,
    };
    const abc = service.use(req, res, () => {
      return;
    });
    expect(res.statusCode).toEqual(400);
  });
});

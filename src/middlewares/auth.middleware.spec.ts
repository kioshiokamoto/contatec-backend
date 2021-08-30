import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { AuthMiddleware } from './auth.middleware';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
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
    service.use(req, res, () => {
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
    service.use(req, res, () => {
      return;
    });
    expect(res.statusCode).toEqual(400);
  });
  it('La operación sale con éxito', () => {
    const id = 1;
    req.user = 'name';
    const token = jwt.sign(
      {
        id: id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30m',
      },
    );
    req.headers = {
      authorization: `Bearer ${token}`,
    };
    service.use(req, res, () => {
      return;
    });
    expect(req.user).toEqual({
      id: id,
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
});

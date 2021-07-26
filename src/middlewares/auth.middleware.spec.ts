import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let testingModule: TestingModule;
  let service: AuthMiddleware;
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
    const req = mocks.createRequest();
    const res = mocks.createResponse();
    const demo = service.use(req, res, () => {
      return;
    });
    expect(service.use).toMatchSnapshot();
  });
});

import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('User Controller', () => {
  let userController: UserController;
  const mockUserService = {
    register: jest.fn((dto) => {
      return 'Se envio mensaje a tu correo electrónico';
    }),
    activateEmail: jest.fn().mockImplementation((dto) => {
      return 'La cuenta ha sido activada';
    }),
    forgotPassword: jest.fn().mockImplementation((dto) => {}),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  it('Controlador debe estar definido', () => {
    expect(userController).toBeDefined();
  });

  it('Usuario debe poder registrarse', () => {
    const userDto = {
      us_nombre: 'Jose',
      us_apellido: 'Oka',
      us_correo: 'ikjor29@gmail.com',
      password: '123456',
    };
    expect(userController.register(userDto)).toEqual(
      'Se envio mensaje a tu correo electrónico',
    );

    expect(mockUserService.register).toHaveBeenCalledWith(userDto);
  });

  it('Usuario debe enviar token de activacion', () => {
    const activateDto = {
      activation_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI1ODcwNzkwLCJleHAiOjE2MjU4NzI1OTB9.0j4lhCv4H3bFvWGgvGYPloxWM_Wfe5CG0kEl3y2P0YQ',
    };
    expect(userController.activateEmail(activateDto)).toEqual(
      'La cuenta ha sido activada',
    );
    expect(mockUserService.activateEmail).toHaveBeenCalledWith(activateDto);
  });
});

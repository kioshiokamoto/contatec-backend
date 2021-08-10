import { Test } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
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
    forgotPassword: jest.fn().mockImplementation((dto) => {
      return 'Se envio mensaje a tu correo electrónico';
    }),
    resetPassword: jest.fn().mockImplementation((dto) => {
      return 'Contraseña a sido cambiada';
    }),
    login: jest.fn().mockImplementation((dto) => {
      return 'Inicio de sesión exitoso';
    }),
    getAccessToken: jest.fn().mockImplementation((dto) => {
      return {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI1ODcwNzkwLCJleHAiOjE2MjU4NzI1OTB9.0j4lhCv4H3bFvWGgvGYPloxWM_Wfe5CG0kEl3y2P0YQ',
      };
    }),
    googleLogin: jest.fn().mockImplementation((dto) => {
      return 'Inicio de sesión exitoso';
    }),
    facebookLogin: jest.fn().mockImplementation((dto) => {
      return 'Inicio de sesión exitoso';
    }),
    logout: jest.fn().mockImplementation((dto) => {
      return 'Se cerro sesion exitosamente';
    }),
    getUserInfo: jest.fn().mockImplementation((dto) => {
      return {
        id: 1,
        createdAt: '2021-07-07T03:50:13.293Z',
        updatedAt: '2021-07-07T03:50:13.293Z',
        us_correo: 'ikjor29@gmail.com',
        us_nombre: 'Doe',
        us_apellido: 'Doe',
        avatar: '',
        posts: [],
      };
    }),
    updateUser: jest.fn().mockImplementation((dto) => {
      return 'Usuario a sido actualizado';
    }),
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
  it('Usuario debe poder solicitar cambiar contraseña', () => {
    const forgotPassDto = {
      us_correo: 'kjor29@gmail.com',
    };
    expect(userController.forgotPassword(forgotPassDto)).toEqual(
      'Se envio mensaje a tu correo electrónico',
    );
    expect(mockUserService.forgotPassword).toHaveBeenCalledWith(forgotPassDto);
  });
  it('Usuario debe poder cerrar sesion', () => {
    const res = mocks.createResponse();
    expect(userController.logout(res)).toEqual('Se cerro sesion exitosamente');
    expect(mockUserService.logout).toHaveBeenCalledWith(res);
  });
  it('Usuario debe poder solicitar informacion de el', () => {
    const req = mocks.createRequest();
    expect(userController.getUserInfo(req)).toEqual({
      id: 1,
      createdAt: '2021-07-07T03:50:13.293Z',
      updatedAt: '2021-07-07T03:50:13.293Z',
      us_correo: 'ikjor29@gmail.com',
      us_nombre: 'Doe',
      us_apellido: 'Doe',
      avatar: '',
      posts: [],
    });
    expect(mockUserService.getUserInfo).toHaveBeenCalled();
  });
  it('Usuario debe poder actualizar su informacion', () => {
    const req = mocks.createRequest();

    const updateUserDto = {
      us_nombre: 'Doe',
      us_apellido: 'Doe',
      avatar: '',
    };
    expect(userController.updateUser(updateUserDto, req)).toEqual(
      'Usuario a sido actualizado',
    );
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });
  it('Usuario debe poder iniciar sesion con google', () => {
    const res = mocks.createResponse();
    const googleDto = {
      tokenId:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI1ODcwNzkwLCJleHAiOjE2MjU4NzI1OTB9.0j4lhCv4H3bFvWGgvGYPloxWM_Wfe5CG0kEl3y2P0YQ',
    };
    expect(userController.googleLogin(googleDto, res)).toEqual(
      'Inicio de sesión exitoso',
    );
    expect(mockUserService.googleLogin).toHaveBeenCalledWith(googleDto, res);
  });
  it('Usuario debe poder iniciar sesion con facebook', () => {
    const res = mocks.createResponse();
    const facebookDto = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI1ODcwNzkwLCJleHAiOjE2MjU4NzI1OTB9.0j4lhCv4H3bFvWGgvGYPloxWM_Wfe5CG0kEl3y2P0YQ',
      userID: '18432164131',
    };
    expect(userController.facebookLogin(facebookDto, res)).toEqual(
      'Inicio de sesión exitoso',
    );
    expect(mockUserService.facebookLogin).toHaveBeenCalledWith(
      facebookDto,
      res,
    );
  });
  it('Usuario debe resetear su contraseña', () => {
    const req = mocks.createRequest();
    const body = {
      password: '123456',
    };
    expect(userController.resetPassword(req, body)).toEqual(
      'Contraseña a sido cambiada',
    );
    expect(mockUserService.resetPassword).toHaveBeenCalled();
  });
  it('Usuario debe poder obtener su token', () => {
    const req = mocks.createRequest();
    expect(userController.getAccessToken(req)).toEqual({
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI1ODcwNzkwLCJleHAiOjE2MjU4NzI1OTB9.0j4lhCv4H3bFvWGgvGYPloxWM_Wfe5CG0kEl3y2P0YQ',
    });
    expect(mockUserService.getAccessToken).toHaveBeenCalledWith(req);
  });
  it('Usuario debe logearse', () => {
    const body = {
      us_correo: 'joahndoe@email.com',
      password: '123458',
    };
    const res = mocks.createResponse();
    expect(userController.login(body, res)).toEqual('Inicio de sesión exitoso');
    expect(mockUserService.login).toHaveBeenCalledWith(body, res);
  });
});

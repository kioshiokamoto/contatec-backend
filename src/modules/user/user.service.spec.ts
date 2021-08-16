import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ActivateEmailDto,
  FacebookLoginDto,
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  UpdateUserDto,
} from './dtos/';
import * as mocks from 'node-mocks-http';
import * as sendEmail from '../../utils/sendMail';
import {
  UserService,
  createActivationToken,
  createRefreshToken,
  createAccessToken,
} from './user.service';
import * as bcrypt from 'bcrypt';
import Usuario from '../../entity/usuario.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<Usuario>, jest.Mock>
>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<Usuario>;
  const userDto = {
    password: '12345',
    us_apellido: 'lastname',
    us_correo: 'email@example.com',
    us_nombre: 'name',
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(Usuario));
  });
  it('Debería estar definido', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    const userDto = {
      password: '12345',
      us_apellido: 'lastname',
      us_correo: 'email@example.com',
      us_nombre: 'name',
    };
    const user = new Usuario({});
    it('Un usuario existente se registra', async () => {
      userRepository.findOne.mockReturnValue(user);
      const res = await service.register(userDto);
      expect(res).toBeInstanceOf(Error);
      expect(res.response).toEqual({ status: 400, error: 'Usuario ya existe' });
    });
    it('El usuario debería poder registrarse', async () => {
      jest.spyOn(sendEmail, 'default').mockReturnThis();
      userRepository.findOne.mockReturnValue(undefined);
      const res = await service.register(userDto);
      expect(res.message).toEqual('Se envio mensaje a tu correo electrónico');
    });
  });
  describe('activateEmail', () => {
    const token = createActivationToken(userDto);
    const activateEmail = new ActivateEmailDto();
    activateEmail.activation_token = token;
    it('Un usuario existente intenta activar su cuenta', async () => {
      userRepository.findOne.mockReturnValue(new Usuario({}));
      const res = await service.activateEmail(activateEmail);
      expect(res).toBeInstanceOf(Error);
      expect(res.response).toEqual('Usuario ya existe');
    });
    it('El usuario debería poder activar su cuenta', async () => {
      jest.spyOn(sendEmail, 'default').mockReturnThis();
      userRepository.findOne.mockReturnValue(undefined);
      userRepository.create.mockReturnValue(
        new Usuario({
          save: jest.fn(),
        }),
      );
      const res = await service.activateEmail(activateEmail);
      expect(res.message).toEqual('La cuenta ha sido activada');
    });
  });
  describe('login', () => {
    const login = new LoginDto();
    login.password = '12345';
    const response = mocks.createResponse();
    it('Un usuario desconocido intenta iniciar sesión', async () => {
      userRepository.findOne.mockReturnValue(undefined);
      await service.login(login, response);
      expect(response.statusCode).toEqual(404);
    });
    it('Un usuario intenta inicar sesión con contraseña errónea', async () => {
      userRepository.findOne.mockReturnValue(new Usuario({ password: '1' }));
      await service.login(login, response);
      expect(response.statusCode).toEqual(403);
    });
    it('El usuario debería poder iniciar sesión', async () => {
      const password = await bcrypt.hash('12345', 6);
      userRepository.findOne.mockReturnValue(
        new Usuario({ id: 1, password: password }),
      );
      await service.login(login, response);
      expect(response.statusCode).toEqual(200);
    });
  });
  describe('getAccessToken', () => {
    const refreshToken = createRefreshToken({ id: 1 });
    const accessToken = createAccessToken({ id: 1 });
    const req = mocks.createRequest();
    it('getAccessToken fails', async () => {
      const response = await service.getAccessToken(req);
      expect(response).toBeInstanceOf(Error);
      expect(response.response).toEqual('Porfavor, inicia sesión ahora');
      expect(response.status).toEqual(401);
    });
    it('getAccessToken throws an error', async () => {
      req.cookies.refreshtoken = '11';
      const response = await service.getAccessToken(req);
      expect(response).toBeInstanceOf(Error);
      expect(response.response).toEqual('Porfavor, inicia sesión ahora');
      expect(response.status).toEqual(401);
    });
    it('getAccessToken should be successful', async () => {
      req.cookies.refreshtoken = refreshToken;
      const response = await service.getAccessToken(req);
      expect(response.access_token).toEqual(accessToken);
    });
  });
  describe('forgotPassword', () => {
    const forgotPassword = new ForgotPasswordDto();
    forgotPassword.us_correo = 'abc@example.com';
    it('Un usario no existente intenta pedir reestablecer su contraseña', async () => {
      userRepository.findOne.mockReturnValue(undefined);
      const response = await service.forgotPassword(forgotPassword);
      expect(response).toBeInstanceOf(Error);
      expect(response.response).toEqual('Usuario no existe');
      expect(response.status).toEqual(404);
    });
    it('El usuario debería poder pedir reestablecer su contraseña', async () => {
      userRepository.findOne.mockReturnValue(new Usuario({ id: 1 }));
      const response = await service.forgotPassword(forgotPassword);
      expect(response.message).toEqual(
        'Se envio mensaje a tu correo electrónico',
      );
    });
  });
  describe('resetPassword', () => {
    const req = {
      body: { password: '12345' },
      user: { id: 1 },
    };
    it('Un usario no existente intenta reestablecer su contraseña', async () => {
      userRepository.findOne.mockReturnValue(undefined);
      const response = await service.resetPassword(req);
      expect(response).toBeInstanceOf(Error);
      expect(response.response).toEqual('Usuario no existe');
      expect(response.status).toEqual(404);
    });
    it('El usuario debería poder reestablecer su contraseña', async () => {
      userRepository.findOne.mockReturnValue(
        new Usuario({ save: jest.fn().mockReturnThis() }),
      );
      const response = await service.resetPassword(req);
      expect(response.message).toEqual('Contraseña a sido cambiada');
    });
  });
  describe('facebookLogin', () => {
    const facelogin = new FacebookLoginDto();
    facelogin.userID = process.env.TEST_FACEBOOK_USER_ID;
    facelogin.accessToken = process.env.TEST_FACEBOOK_ACCESS_TOKEN;
    const res = mocks.createResponse();
    it('Inicia sesión con un usuario nuevo', async () => {
      userRepository.findOne.mockReturnValue(undefined);
      userRepository.create.mockReturnValue(
        new Usuario({ id: 1, save: jest.fn() }),
      );
      await service.facebookLogin(facelogin, res);
      expect(res.statusCode).toEqual(200);
    });
    it('Contraseñas no son compatibles', async () => {
      userRepository.findOne.mockReturnValue(new Usuario({ password: '1' }));
      await service.facebookLogin(facelogin, res);
      expect(res.statusCode).toEqual(401);
    });
    it('Inicia sesión con un usuario ya existente', async () => {
      const pass = process.env.TEST_FACEBOOK_MAIL + process.env.FACEBOOK_SECRET;
      const passHash = await bcrypt.hash(pass, 6);
      userRepository.findOne.mockReturnValue(
        new Usuario({ id: 1, password: passHash }),
      );
      await service.facebookLogin(facelogin, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('googleLogin', () => {
    const googlelogin = new GoogleLoginDto();
    process.env.MAILING_SERVICE_CLIENT_ID =
      process.env.TEST_GOOGLE_TOKEN_CLIENT_ID;
    const res = mocks.createResponse();
    it('El email no ha sido verificado', async () => {
      googlelogin.tokenId = process.env.TEST_GOOGLE_TOKEN_ID_1;
      userRepository.findOne.mockReturnValue(undefined);
      await service.googleLogin(googlelogin, res);
      expect(res.statusCode).toEqual(401);
    });
    it('Inicia sesión con usuario existente', async () => {
      googlelogin.tokenId = process.env.TEST_GOOGLE_TOKEN_ID_2;
      const password =
        process.env.TEST_GOOGLE_EMAIL + process.env.GOOGLE_SECRET;
      const hashpassword = await bcrypt.hash(password, 6);
      userRepository.findOne.mockReturnValue(
        new Usuario({ password: hashpassword }),
      );
      await service.googleLogin(googlelogin, res);
      expect(res.statusCode).toEqual(200);
    });
    it('Las contraseñas no se igualan', async () => {
      googlelogin.tokenId = process.env.TEST_GOOGLE_TOKEN_ID_2;
      const password = 'gaaa' + process.env.GOOGLE_SECRET;
      const hashpassword = await bcrypt.hash(password, 6);
      userRepository.findOne.mockReturnValue(
        new Usuario({ password: hashpassword }),
      );
      await service.googleLogin(googlelogin, res);
      expect(res.statusCode).toEqual(401);
    });
    it('Inicia sesión con un usuario nuevo', async () => {
      googlelogin.tokenId = process.env.TEST_GOOGLE_TOKEN_ID_3;
      userRepository.findOne.mockReturnValue(undefined);
      userRepository.create.mockReturnValue(
        new Usuario({ id: 1, save: jest.fn() }),
      );
      await service.googleLogin(googlelogin, res);
      expect(res.statusCode).toEqual(200);
    });
  });
  describe('logout', () => {
    const resp = mocks.createResponse();
    it('El usuario debería poder cerrar sesión', async () => {
      await service.logout(resp);
      expect(resp.statusCode).toEqual(200);
    });
    it('Ocurre un error al salir de la sesión', async () => {
      jest.spyOn(resp, 'cookie').mockImplementation(() => {
        throw new HttpException('Logout failed', HttpStatus.UNAUTHORIZED);
      });
      await service.logout(resp);
      expect(resp.statusCode).toEqual(401);
    });
  });
  describe('getUserInfo', () => {
    const req = {
      user: { id: 1 },
    };
    it('El usuario debería poder ver su información', async () => {
      userRepository.findOne.mockReturnValue(new Usuario({ id: 1 }));
      const response = await service.getUserInfo(req);
      expect(response).toBeInstanceOf(Usuario);
    });
    it('El usuario no puede ver su información', async () => {
      userRepository.findOne.mockRejectedValue(
        new Error('Error al obtener información'),
      );
      const response = await service.getUserInfo(req);
      expect(response).toBeInstanceOf(Error);
      expect(response.message).toEqual('Error al obtener información');
    });
  });
  describe('updateUser', () => {
    const req = {
      user: { id: 1 },
    };
    const user = new Usuario({ save: jest.fn() });
    const updateUser = new UpdateUserDto();
    updateUser.avatar = 'avatar';
    updateUser.password = '12345';
    updateUser.us_apellido = 'lastname';
    updateUser.us_nombre = 'name';
    it('El usuario actualiza su información sin ningún cambio', async () => {
      userRepository.findOne.mockReturnValue(user);
      const response = await service.updateUser(new UpdateUserDto(), req);
      expect(response.message).toEqual('Usuario a sido actualizado');
    });
    it('El usuario actualiza su información con cambios', async () => {
      userRepository.findOne.mockReturnValue(user);
      const response = await service.updateUser(updateUser, req);
      expect(response.message).toEqual('Usuario a sido actualizado');
    });
    it('El usuario no puede actualizar su información', async () => {
      userRepository.findOne.mockReturnValue(undefined);
      const response = await service.updateUser(updateUser, req);
      expect(response).toBeInstanceOf(Error);
      expect(response.response).toEqual('Usuario no existe');
      expect(response.status).toEqual(404);
    });
  });
});

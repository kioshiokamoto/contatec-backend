import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import {
  ActivateEmailDto,
  CreateUserDto,
  FacebookLoginDto,
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  ResetPasswordDto,
} from './dtos';
import Usuario from 'src/entity/usuario.entity';
import sendEmail from 'src/utils/sendMail';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';

const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;
const logger = new Logger();
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      const { us_correo, us_nombre, us_apellido, password } = dto;
      const user = await this.usuariosRepository.findOne({ us_correo });
      if (user) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Usuario ya existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const activation_token = createActivationToken(dto);

      const url = `${CLIENT_URL}/usuario/activar/${activation_token}`;

      sendEmail(us_correo, url, 'Click aquí');
      return {
        message: 'Se envio mensaje a tu correo electrónico',
      };
    } catch (error) {
      return error;
    }
  }
  async activateEmail(dto: ActivateEmailDto) {
    try {
      const user: CreateUserDto = jwt.verify(
        dto.activation_token,
        process.env.ACTIVATION_TOKEN_SECRET,
      );
      const { us_nombre, us_apellido, password, us_correo } = user;
      const check = await this.usuariosRepository.findOne({ us_correo });
      if (check) {
        throw new HttpException('Usuario ya existe', HttpStatus.CONFLICT);
      }
      const newUser = await this.usuariosRepository.create({
        us_nombre,
        us_apellido,
        password,
        us_correo,
      });
      await newUser.save();
      logger.log('Se registro un usuario nuevo');
      return {
        message: 'La cuenta ha sido activada',
      };
    } catch (error) {
      return error;
    }
  }
  async login(dto: LoginDto, res: Response) {
    try {
      const { us_correo, password } = dto;
      const user = await this.usuariosRepository.findOne({ us_correo });

      if (!user) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException('Contraseña errada', HttpStatus.FORBIDDEN);
      }
      const refresh_token = createRefreshToken({ id: user.id });
      console.log('refresh_token', refresh_token);
      // res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
      // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      // res.set  Header('Access-Control-Allow-Credentials', 'true');
      res.cookie('refreshtoken', refresh_token, {
        // httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // secure: true,
        // path: '/api/user/refresh_token',
      });
      res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
      res.status(error.status).json(error);
    }
  }
  async getAccessToken(req: Request) {
    try {
      const rf_token = req.cookies.refreshtoken;
      console.log(req.cookies);
      console.log('rf_token', rf_token);
      if (!rf_token) {
        throw new HttpException(
          'Porfavor, inicia sesión ahora',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const access_token = jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            throw new HttpException(
              'Porfavor, inicia sesión ahora',
              HttpStatus.UNAUTHORIZED,
            );
          }
          return createAccessToken({ id: user.id });
        },
      );

      return { access_token };
    } catch (error) {
      return error;
    }
  }
  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const { us_correo } = dto;
      const user = await this.usuariosRepository.findOne({ us_correo });
      if (!user) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }
      const access_token = createAccessToken({ id: user.id });
      const url = `${CLIENT_URL}/usuario/resetear/${access_token}`;

      sendEmail(us_correo, url, 'Resetear password');

      return {
        message: 'Se envio mensaje a tu correo electrónico',
      };
    } catch (error) {
      return error;
    }
  }
  async resetPassword(req: any) {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 6);
      const user = await this.usuariosRepository.findOne({ id: req?.user.id });

      if (!user) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }
      user.password = passwordHash;
      user.save();
      return {
        message: 'Contraseña a sido cambiada',
      };
    } catch (error) {
      return error;
    }
  }
  async googleLogin(dto: GoogleLoginDto, res: Response) {
    //Verificar funcionamiento con login!
    try {
      const { tokenId } = dto;
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });
      const { email_verified, email, name, picture } = verify.getPayload();

      const password = email + process.env.GOOGLE_SECRET;

      if (!email_verified) {
        throw new HttpException(
          'Verificacion de correo fallida',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = await this.usuariosRepository.findOne({ us_correo: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new HttpException(
            'Contraseña erronea',
            HttpStatus.UNAUTHORIZED,
          );
        }
        const refresh_token = createRefreshToken({ id: user.id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/api/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
      } else {
        const newUser = this.usuariosRepository.create({
          us_nombre: name.split(' ')[0],
          us_apellido: name.split(' ')[1],
          us_correo: email,
          password,
          avatar: picture,
        });
        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser.id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/api/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
      }
    } catch (error) {
      res.status(error.status).json(error);
    }
  }
  async facebookLogin(dto: FacebookLoginDto, res: Response) {
    try {
      const { accessToken, userID } = dto;

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=name,email,picture&access_token=${accessToken}`;

      //Verificar si se puede cambiar por modulo http de nestjs
      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + process.env.FACEBOOK_SECRET;

      const user = await this.usuariosRepository.findOne({ us_correo: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new HttpException(
            'Contraseña erronea',
            HttpStatus.UNAUTHORIZED,
          );
        }

        const refresh_token = createRefreshToken({ id: user.id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/api/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
      } else {
        const newUser = this.usuariosRepository.create({
          us_nombre: name.split(' ')[0],
          us_apellido: name.split(' ')[1],
          us_correo: email,
          password,
          avatar: picture.data.url,
        });
        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser.id });
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/api/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        console.log('funcion');
        res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
      }
    } catch (error) {
      res.status(error.status).json(error);
    }
  }
  async logout(res: Response) {
    try {
      res.clearCookie('refreshtoken', { path: '/api/user/refresh_token' });
      return {
        message: 'Contraseña a sido cambiada',
      };
    } catch (error) {
      return error;
    }
  }
  async getUserInfo(req: any) {
    try {
      const user = await this.usuariosRepository.findOne({ id: req.user.id });
      return user;
    } catch (error) {
      return error;
    }
  }
  async updateUser(dto: UpdateUserDto, req: any) {
    try {
      const { us_nombre, us_apellido, avatar, password } = dto;
      const user = await this.usuariosRepository.findOne({ id: req.user.id });
      if (!user) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }
      if (us_nombre) {
        user.us_nombre = us_nombre;
        //Verificar si tiene nombre
      }
      if (us_apellido) {
        user.us_apellido = us_apellido;
        //Verificar si tiene apellido
      }
      if (avatar) {
        user.avatar = avatar;
        //Verificar si tiene avatar
      }
      if (password) {
        const passwordHash = await bcrypt.hash(password, 6);
        user.password = passwordHash;
        //Verificar si tiene password
      }
      user.save();
      return {
        message: 'Usuario a sido actualizado',
      };
    } catch (error) {
      return error;
    }
  }
}

function createActivationToken(payload) {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '5m',
  });
}
function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}
function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { UpdateUserDto } from './dtos/update-user.dto';
import { getManager, Repository } from 'typeorm';
import Usuario from '../../entity/usuario.entity';
import sendEmail from '../../utils/sendMail';
import {
  ActivateEmailDto,
  CreateUserDto,
  FacebookLoginDto,
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
} from './dtos';

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
      const { us_correo } = dto;
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
      // console.log('refresh_token', refresh_token);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Cookie,Set-Cookie,Accept,Content-Type',
      );
      setUserCookies(7 * 24 * 60 * 60 * 1000, res, refresh_token);
      res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
      res.status(error.status).json(error);
    }
  }
  async getAccessToken(req: Request) {
    try {
      const rf_token = req.cookies.refreshtoken;
      // console.log(req.cookies);
      // console.log('rf_token', rf_token);
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
      console.log({ email_verified, email, name, picture });
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
        setUserCookies(7 * 24 * 60 * 60 * 1000, res, refresh_token);
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
        setUserCookies(7 * 24 * 60 * 60 * 1000, res, refresh_token);
        res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
      }
    } catch (error) {
      console.log(error);
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
        setUserCookies(7 * 24 * 60 * 60 * 1000, res, refresh_token);
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
        setUserCookies(7 * 24 * 60 * 60 * 1000, res, refresh_token);
        res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
      }
    } catch (error) {
      res.status(error.status).json(error);
    }
  }

  async logout(res: Response) {
    try {
      // console.log(res.cookie);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Cookie,Set-Cookie,Accept,Content-Type',
      );

      setUserCookies(10, res, '');
      console.log('Eliminando Cookie');
      res
        .status(HttpStatus.OK)
        .json({ message: 'Se cerro sesion exitosamente' });
    } catch (error) {
      res.status(error.status).json(error);
    }
  }
  async getUserInfo(req: any) {
    try {
      const user = await this.usuariosRepository.findOne(
        { id: req.user.id },
        { relations: ['posts', 'posts.pstCategoriaId'] },
      );
      const entityManager = getManager();
      const data = await entityManager.query(
        `
          SELECT
              T.id as trb_ID, T.createdAt as trb_createdAt, T.updatedAt as trb_updatedAt, T.trb_cancelado as trb_cancelado, T.id_pago as trb_idPago, T.id_mensaje as trb_idMensaje, T.trb_estado as trb_estado,
              M.id as msj_id ,M.msj_precio_prop as msj_precio_prop,M.msj_contenido as msj_contenido,M.msj_descripcion_prop as msj_descripcion_prop, M.msjIdPostPropuestaId as msjIdPostPropuestaId,
              CASE WHEN U.id=M.msjUserFromId THEN 1 ELSE 0 END provider
          FROM mensaje M
              INNER JOIN trabajo T ON(M.id=T.id_mensaje)
              INNER JOIN usuario U ON(U.id in (M.msjUserFromId,M.msjUserToId))
          WHERE U.id=${req.user.id};
        `,
      );
      // console.log(data);
      return {
        user,
        data,
      };
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

export function createActivationToken(payload) {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}
export function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m',
  });
}
export function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}
export function setUserCookies(time: any, res: any, refresh_token: any) {
  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/user/refresh_token',
    sameSite: 'none',
    secure: true,
  });
}

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Usuario from 'src/entity/usuario.entity';
import { Repository } from 'typeorm';
import { ActivateEmailDto, CreateUserDto, LoginDto } from './dtos';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import sendEmail from 'src/utils/sendMail';
import { Request, Response } from 'express';
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
        throw new HttpException('Usuario ya existe', HttpStatus.CONFLICT);
      }
      const activation_token = createActivationToken(dto);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;

      sendEmail(us_correo, url, 'Click aquí');
      return {
        message: 'Se envio mensaje a tu correo electrónico',
      };
    } catch (error) {
      //throw new HttpException('ERROR', HttpStatus.CONFLICT);
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
        throw new HttpException('Contraseña erronea', HttpStatus.UNAUTHORIZED);
      }
      const refresh_token = createRefreshToken({ id: user.id });
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
      return error;
    }
  }
  async getAccessToken(req: Request) {
    try {
      const rf_token = req.cookies.refreshtoken;
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Usuario from 'src/entity/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos';
import * as jwt from 'jsonwebtoken';
import sendEmail from 'src/utils/sendMail';
const { CLIENT_URL } = process.env;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
  ) {}
  async createUser(dto: CreateUserDto) {
    const newUser = this.usuariosRepository.create(dto);
    console.log(newUser);
    const user = await this.usuariosRepository.save(newUser);
    //console.log(user);
    return user;
  }
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
      return { error: `error ${error}` };
    }
  }
  async activateEmail() {}
  async login() {}
  async getAccessToken() {}
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

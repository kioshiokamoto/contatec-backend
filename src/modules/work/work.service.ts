/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from 'src/entity/post.entity';
import Trabajo from 'src/entity/trabajo.entity';
import { Repository } from 'typeorm';
import { AcceptPropose } from './dtos';

enum Estado {
  Contratado = 'Contratado',
  EnProceso = 'En proceso',
  Finalizado = 'Finalizado',
  Cancelado = 'Cancelado',
}
@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Trabajo)
    private workRepository: Repository<Trabajo>,
  ) {}
  async acceptPropose(acceptProposeDto: AcceptPropose) {
    try {
      //Solo se deben poder acpetar propuestas cuyo mensaje sea tipo 'Propuesta'
      const { id_mensaje } = acceptProposeDto;
      const work = this.workRepository.create({
        trb_mensaje: id_mensaje,
      });
      const savedWork = await work.save();

      const workReltations = await this.workRepository.findOne(
        { id: savedWork.id },
        { relations: ['trb_pago', 'trb_mensaje'] },
      );
      return workReltations;
    } catch (error) {
      return error;
    }
  }

  async cancelWork(id) {
    try {
      const work = await this.workRepository.findOne(id);

      if (!work) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Trabajo no existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.workRepository.update(
        { id },
        { trb_estado: 'Cancelado' as Estado },
      );
      return {
        message: 'Se canceló el trabajo',
      };
    } catch (error) {
      return error;
    }
  }
}

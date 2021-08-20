import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from '../../entity/post.entity';
import Trabajo from '../../entity/trabajo.entity';
import { Repository } from 'typeorm';
import { AcceptPropose, UpdateWork } from './dtos';
import { Estado } from './enum/estado';

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
      return {
        message: 'Se aceptó propuesta correctamente',
        data: {
          ...workReltations,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async cancelWork(id: number) {
    try {
      const work = await this.workRepository.findOne(id);

      if (!work) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Trabajo no existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        work.trb_estado === 'Cancelado' ||
        work.trb_estado === 'Finalizado' ||
        work.trb_estado === 'En proceso'
      ) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'No es posible cancelar trabajo',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      work.trb_estado = 'Cancelado' as Estado;
      await work.save();

      return {
        message: 'Se canceló el trabajo correctamente',
      };
    } catch (error) {
      return error;
    }
  }
  async updateStatus(id: number, updateWorkDto: UpdateWork) {
    try {
      const { id_pago, trb_cancelado, trb_estado } = updateWorkDto;
      const work = await this.workRepository.findOne(id);

      if (!work) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Trabajo no existe' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (trb_estado) {
        work.trb_estado = trb_estado;
      }
      if (trb_cancelado) {
        work.trb_cancelado = trb_cancelado;
      }
      if (id_pago) {
        work.trb_pago = id_pago;
      }
      await work.save();

      return {
        message: 'Se actualizó estado de trabajo correctamente ',
        data: {
          ...work,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Mensaje from 'src/entity/mensaje.entity';
import Usuario from 'src/entity/usuario.entity';
import { getManager, getRepository, Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Mensaje) private messageRepository: Repository<Mensaje>,
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
  ) {}

  async getAllMessages(req: any) {
    const idUsuario = req.user.id;
    const result = await getRepository(Usuario)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.messages', 'message')
      .leftJoinAndSelect('message.msj_idPost_propuesta', 'message_post')
      .leftJoinAndSelect('message.msj_user_from', 'message_from')
      .leftJoinAndSelect('message.msj_user_to', 'message_to')
      .where('user.id = :id', { id: idUsuario })
      // .orderBy("user.id", "DESC")
      .getOne();
    // const entityManager = getManager();
    // const data = await entityManager.query(``);
    return result;
  }

  async getAllMessagesWith(req: any, id: number) {
    //Mensajes con persona seleccionada
    const entityManager = getManager();
    const data = await entityManager.query(`
      SELECT
            M.createdAt,
            msj_contenido,
            msjIdPostPropuestaId,
            msjUserFromId,
            msjUserToId
        FROM mensaje M
            INNER JOIN usuario U ON(M.msjUserFromId=U.id)
        WHERE U.id=${id}
        UNION
        SELECT
            M.createdAt,
            msj_contenido,
            msjIdPostPropuestaId,
            msjUserFromId,
            msjUserToId
        FROM mensaje M
            INNER JOIN usuario U ON(M.msjUserToId=U.id)
        WHERE U.id=${id}
        ORDER BY 1 DESC;
    `);

    // Marcar como leido todos los mensajes!

    return data;
  }
}

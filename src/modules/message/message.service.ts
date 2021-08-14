import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Mensaje from '../../entity/mensaje.entity';
import Usuario from '../../entity/usuario.entity';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Mensaje) private messageRepository: Repository<Mensaje>,
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
  ) {}

  async getAllMessages(req: any) {
    const idUsuario = req.user.id;

    const entityManager = getManager();
    const data = await entityManager.query(`
      SELECT  M.id,M.msjUserFromId,M.msjUserToId,M.createdAt,M.msj_contenido,
        CONCAT(U.us_nombre,' ',U.us_apellido) as nameAmiwi ,U.avatar as ImagenAmiwi,
          U.id as idAmiwi
      FROM mensaje M
        INNER JOIN (
          SELECT
            CASE WHEN msjUserFromId > msjUserToId THEN msjUserFromId ELSE msjUserToId END muser1,
            CASE WHEN msjUserFromId <= msjUserToId THEN msjUserFromId ELSE msjUserToId END muser2,
            MAX(createdAt) AS max_createat
          FROM mensaje
          WHERE ${idUsuario} IN (msjUserFromId, msjUserToId)
          GROUP BY muser1 , muser2 ) AS filtro
        ON((M.msjUserFromId IN(filtro.muser1, filtro.muser2)) AND
          (M.msjUserToId IN(filtro.muser1, filtro.muser2)) AND
              (M.createdAt = filtro.max_createat))
        INNER JOIN usuario U ON(CASE WHEN filtro.muser1 IN(${idUsuario}) THEN U.id=filtro.muser2 ELSE U.id=filtro.muser1 END)
      ORDER BY 4 DESC;
    `);
    return data;
  }

  async getAllMessagesWith(req: any, id: number) {
    const idUsuario = req.user.id;
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
          INNER JOIN usuario U1 ON(M.msjUserToId=U1.id)
      WHERE U.id=${id} AND U1.id=${idUsuario}
      UNION
      SELECT
          M.createdAt,
          msj_contenido,
          msjIdPostPropuestaId,
          msjUserFromId,
          msjUserToId
      FROM mensaje M
          INNER JOIN usuario U ON(M.msjUserFromId=U.id)
          INNER JOIN usuario U1 ON(M.msjUserToId=U1.id)
      WHERE U.id=${idUsuario} AND U1.id=${id}
      ORDER BY 1 DESC;
    `);

    const userFriend = await this.userRepository.findOne({ id: id });

    // Marcar como leido todos los mensajes!

    return {
      data: [...data],
      nombreAmigo: userFriend.us_correo + ' ' + userFriend.us_apellido,
      fotoAmigo: userFriend.avatar,
    };
  }
}

/* istanbul ignore file */
import { Column, Entity as TOEntity, ManyToOne } from 'typeorm';
import Entity from './base.entity';
import Post from './post.entity';
import Usuario from './usuario.entity';

export enum Estado {
  Mensaje = 'Mensaje',
  Propuesta = 'Propuesta',
}

@TOEntity('mensaje')
export default class Mensaje extends Entity {
  constructor(mensaje: Partial<Mensaje>) {
    super();
    Object.assign(this, mensaje);
  }

  @Column()
  msj_contenido: string;

  @Column()
  msj_rol: Estado;

  @Column({ default: null })
  msj_precio_prop: number;

  @Column({ default: null })
  msj_descripcion_prop: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP + 5',
  })
  msj_caducidad_prop: Date;

  @ManyToOne(() => Post, (post) => post.id)
  msj_idPost_propuesta: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  msj_user_from: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  msj_user_to: number;
}

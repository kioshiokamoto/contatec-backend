import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import Entity from './base.entity';
import Usuario from './usuario.entity';

@TOEntity('post')
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Column()
  pst_isActive: boolean;

  @Column()
  pst_descripcion: string;

  @Column()
  pst_imagen: string;

  @Column()
  pst_precioBase: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  pst_idUsuario: number;

  // @OneToOne(() => Post, (post) => post.id)
  // rw_idPost: number;
}

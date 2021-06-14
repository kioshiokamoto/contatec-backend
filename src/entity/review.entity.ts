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

@TOEntity('review')
export default class Review extends Entity {
  constructor(review: Partial<Review>) {
    super();
    Object.assign(this, review);
  }

  @Column()
  rw_score: number;

  @Column()
  rw_comentario: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  rw_idUsuario: number;

  // @OneToOne(() => Post, (post) => post.id)
  // rw_idPost: number;
}

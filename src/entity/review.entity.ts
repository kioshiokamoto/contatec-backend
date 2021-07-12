/* istanbul ignore file */
import { Column, Entity as TOEntity, ManyToOne } from 'typeorm';
import Entity from './base.entity';
import Post from './post.entity';
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

  @ManyToOne(() => Post, (post) => post.id)
  rw_idPost: number;
}

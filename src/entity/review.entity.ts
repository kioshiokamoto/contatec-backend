/* istanbul ignore file */
import { IsOptional } from 'class-validator';
import { Column, Entity as TOEntity, JoinColumn, ManyToOne } from 'typeorm';
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

  @Column({ default: null })
  rw_comentario: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  rw_idUsuario: number;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'id_post', referencedColumnName: 'id' })
  rw_idPost: number;
}

import { Column, Entity as TOEntity, ManyToOne } from 'typeorm';
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

  @Column({ nullable: true })
  pst_imagen_1: string | undefined;

  @Column({ nullable: true })
  pst_imagen_2: string | undefined;

  @Column({ nullable: true })
  pst_imagen_3: string | undefined;

  @Column({ nullable: true })
  pst_imagen_4: string | undefined;

  @Column({ nullable: true })
  pst_imagen_5: string | undefined;

  @Column()
  pst_precioBase: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  pst_idUsuario: number;

  // @OneToOne(() => Post, (post) => post.id)
  // rw_idPost: number;
}

import { Column, Entity as TOEntity, JoinColumn, ManyToOne } from 'typeorm';
import Entity from './base.entity';
import Categoria from './categoria.entity';
import Usuario from './usuario.entity';

@TOEntity('post')
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Column({ default: true })
  pst_isActive: boolean;

  @Column()
  pst_descripcion: string;

  @Column({ default: null })
  pst_imagen_1: string;

  @Column({ default: null })
  pst_imagen_2: string;

  @Column({ default: null })
  pst_imagen_3: string;

  @Column({ default: null })
  pst_imagen_4: string;

  @Column({ default: null })
  pst_imagen_5: string;

  @Column()
  pst_precioBase: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.posts)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  pstUsuarioId: Usuario;

  @ManyToOne(() => Categoria, (categoria) => categoria.id)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id' })
  pstCategoriaId: Categoria;
}

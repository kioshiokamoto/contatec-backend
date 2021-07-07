import { Column, Entity as TOEntity, OneToMany } from 'typeorm';
import Entity from './base.entity';
import Post from './post.entity';

@TOEntity('categoria')
export default class Categoria extends Entity {
  constructor(categoria: Partial<Categoria>) {
    super();
    Object.assign(this, categoria);
  }

  @Column()
  cat_nombre: string;

  @Column()
  cat_descripcion: string;

  @OneToMany(() => Post, (post) => post.pstCategoriaId)
  posts: Post[];
}

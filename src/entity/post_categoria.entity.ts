import { Entity as TOEntity, ManyToOne } from 'typeorm';
import Entity from './base.entity';
import Categoria from './categoria.entity';
import Post from './post.entity';

@TOEntity('post_categoria')
export default class Post_Categoria extends Entity {
  constructor(post_categoria: Partial<Post_Categoria>) {
    super();
    Object.assign(this, post_categoria);
  }
  @ManyToOne(() => Post, (post) => post.id)
  pstC_idPost: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.id)
  pstC_idCategoria: number;
}

import { Exclude } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  OneToMany,
} from 'typeorm';
import Entity from './base.entity';
import Review from './review.entity';
import * as bcrypt from 'bcrypt';

@TOEntity('usuario')
export default class Usuario extends Entity {
  constructor(user: Partial<Usuario>) {
    super();
    Object.assign(this, user);
  }

  @Index({ unique: true })
  @IsEmail(undefined, {
    message: 'Debe ser una dirección de correo electrónico válida',
  })
  @Length(1, 255, { message: 'El correo electrónico está vacío' })
  @Column()
  us_correo: string;

  @Index()
  @Length(3, 255, { message: 'Debe tener al menos 3 caracteres' })
  @Column()
  us_nombre: string;

  @Index()
  @Length(3, 255, { message: 'Debe tener al menos 3 caracteres' })
  @Column()
  us_apellido: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: 'Debe tener al menos 6 caracteres' })
  password: string;

  @Column()
  avatar: string;

  @OneToMany(() => Review, (review) => review.id)
  reviews: Review[];

  // @OneToMany(() => Post, (post) => post.user)
  // posts: Post[];

  // @OneToMany(() => Vote, (vote) => vote.user)
  // votes: Vote[];

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

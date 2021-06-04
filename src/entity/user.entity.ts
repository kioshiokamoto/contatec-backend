import bcrypt from 'bcrypt';
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
@TOEntity('users')
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index({ unique: true })
  @IsEmail(undefined, {
    message: 'Debe ser una dirección de correo electrónico válida',
  })
  @Length(1, 255, { message: 'El correo electrónico está vacío' })
  @Column()
  email: string;

  @Index()
  @Length(3, 255, { message: 'Debe tener al menos 3 caracteres' })
  @Column()
  nombres: string;

  @Index()
  @Length(3, 255, { message: 'Debe tener al menos 3 caracteres' })
  @Column()
  apellidos: string;

  @Index()
  @Column({ default: 'user' })
  role: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: 'Debe tener al menos 6 caracteres' })
  password: string;

  // @OneToMany(() => Post, (post) => post.user)
  // posts: Post[];

  // @OneToMany(() => Vote, (vote) => vote.user)
  // votes: Vote[];

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

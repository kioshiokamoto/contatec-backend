/* istanbul ignore file */
import { Column, Entity as TOEntity } from 'typeorm';
import Entity from './base.entity';

@TOEntity('pago')
export default class Pago extends Entity {
  constructor(pago: Partial<Pago>) {
    super();
    Object.assign(this, pago);
  }

  @Column()
  pgo_nombre: string;

  @Column()
  pgo_apellido: string;

  @Column()
  pgo_dni: string;

  @Column()
  pgo_direccion: string;

  @Column()
  pgo_monto: number;

  @Column()
  pgo_telefono: string;

  @Column()
  pgo_token: string;
}

import { Column, Entity as TOEntity, ManyToOne } from 'typeorm';
import Entity from './base.entity';
import Mensaje from './mensaje.entity';
import Pago from './pago.entity';

enum Estado {
  Contratado = 'Contratado',
  EnProceso = 'En proceso',
  Finalizado = 'Finalizado',
}

@TOEntity('trabajo')
export default class Trabajo extends Entity {
  constructor(trabajo: Partial<Trabajo>) {
    super();
    Object.assign(this, trabajo);
  }

  @Column()
  trb_cancelado: boolean;

  @Column('text')
  trb_estado: Estado;

  @ManyToOne(() => Pago, (pago) => pago.id)
  trb_pago: number;

  @ManyToOne(() => Mensaje, (mensaje) => mensaje.id)
  trb_mensaje: number;
}

/* istanbul ignore file */
import { Column, Entity as TOEntity, JoinColumn, OneToOne } from 'typeorm';
import { Estado } from '../modules/work/enum/estado';
import Entity from './base.entity';
import Mensaje from './mensaje.entity';
import Pago from './pago.entity';

@TOEntity('trabajo')
export default class Trabajo extends Entity {
  constructor(trabajo: Partial<Trabajo>) {
    super();
    Object.assign(this, trabajo);
  }

  @Column({ default: false })
  trb_cancelado: boolean;

  @Column({ default: 'Contratado' })
  trb_estado: Estado;

  @OneToOne(() => Pago, (pago) => pago.id)
  @JoinColumn({ name: 'id_pago', referencedColumnName: 'id' })
  trb_pago: number;

  @OneToOne(() => Mensaje, (mensaje) => mensaje.id)
  @JoinColumn({ name: 'id_mensaje', referencedColumnName: 'id' })
  trb_mensaje: number;
}

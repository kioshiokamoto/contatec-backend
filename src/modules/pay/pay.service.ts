/* istanbul ignore file */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Culqi from 'culqi-node';
import { Repository } from 'typeorm';
import Pago from '../../entity/pago.entity';
import { PayServiceNow } from './dtos/pay-service-now.dto';
//Token de prueba
//tkn_test_vKMujxXlSPGTVpRv
@Injectable()
export class PayService {
  culqi;
  constructor(
    @InjectRepository(Pago) private pagoRepository: Repository<Pago>,
  ) {
    this.culqi = new Culqi({
      privateKey: process.env.SK_CULQI,
    });
  }

  async payServiceNow(payServiceNowDto: PayServiceNow, req: any) {
    try {
      const userPago = req.user.id;
      const charge = await this.culqi.charges.createCharge({
        amount: payServiceNowDto.pgo_monto,
        currency_code: 'PEN',
        email: payServiceNowDto.pgo_correo,
        //token recibido por frontend
        source_id: payServiceNowDto.pgo_token_culqi,
        //source_id: 'tkn_test_IyZHImT5inMdK2JJ',
      });
      console.log(charge.id);

      const newPago = this.pagoRepository.create({
        pgo_dni: payServiceNowDto.pgo_dni,
        pgo_apellido: payServiceNowDto.pgo_apellido,
        pgo_nombre: payServiceNowDto.pgo_nombre,
        pgo_direccion: payServiceNowDto.pgo_direccion,
        pgo_telefono: payServiceNowDto.pgo_telefono,
        pgo_monto: payServiceNowDto.pgo_monto,
        pgo_token: charge.id,
        pgo_usuarioId: userPago,
      });
      await newPago.save();

      return {
        message: 'El pago se realizo correctamente',
        pago: newPago,
      };
    } catch (error) {
      return error;
    }
  }
}

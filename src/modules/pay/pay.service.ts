import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Culqi from 'culqi-node';
import Pago from 'src/entity/pago.entity';
import { Repository } from 'typeorm';
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

  async payServiceNow(payServiceNowDto: any) {
    try {
      const charge = await this.culqi.charges.createCharge({
        amount: '10000',
        currency_code: 'PEN',
        email: 'kjor29@gmail.com',
        //token recibido por frontend
        source_id: 'tkn_test_IyZHImT5inMdK2JJ',
      });

      return {
        message: 'El pago se realizo correctamente',
      };
    } catch (error) {
      return error;
    }
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayServiceNow } from './dtos/pay-service-now.dto';
import { PayService } from './pay.service';

@ApiTags('Pay')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('/service')
  payServiceNow(@Body() payServiceNowDto: PayServiceNow) {
    return this.payService.payServiceNow(payServiceNowDto);
  }
}

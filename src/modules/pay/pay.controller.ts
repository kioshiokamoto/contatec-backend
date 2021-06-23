import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayService } from './pay.service';

@ApiTags('Pay')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('/service')
  payServiceNow(@Body() payServiceNowDto: any) {
    return this.payService.payServiceNow(payServiceNowDto);
  }
}

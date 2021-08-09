import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PayServiceNow } from './dtos/pay-service-now.dto';
import { PayService } from './pay.service';

@ApiTags('Pay')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('/service')
  @ApiBearerAuth('Authorization')
  payServiceNow(@Body() payServiceNowDto: PayServiceNow, @Req() req) {
    return this.payService.payServiceNow(payServiceNowDto, req);
  }
}

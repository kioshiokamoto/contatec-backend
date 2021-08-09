/* istanbul ignore file */
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcceptPropose } from './dtos';
import { WorkService } from './work.service';

@ApiTags('Work')
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('/accept-propose')
  @ApiOperation({ summary: 'Acepta propuesta de servicio' })
  @ApiResponse({
    status: 201,
    description: 'Se aceptó propuesta',
  })
  acceptPropose(@Body() acceptProposeDto: AcceptPropose) {
    return this.workService.acceptPropose(acceptProposeDto);
  }

  @Post('/cancel')
  @ApiOperation({
    summary: 'Cancela propuesta de servicio',
  })
  cancelWork(@Param('id') id: number) {
    return this.workService.cancelWork(id);
  }
}

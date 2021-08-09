/* istanbul ignore file */
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcceptPropose, UpdateWork } from './dtos';
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

  @Patch('/cancel')
  @ApiOperation({
    summary: 'Cancela propuesta de servicio',
  })
  cancelWork(@Param('id') id: number) {
    return this.workService.cancelWork(id);
  }

  @Patch('/update-status')
  @ApiOperation({
    summary: 'Actualiza estado de negocio',
  })
  updateStatus(@Param('id') id: number, @Body() updateWorkDto: UpdateWork) {
    return this.workService.updateStatus(id, updateWorkDto);
  }
}

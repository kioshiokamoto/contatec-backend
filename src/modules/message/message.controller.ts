import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/all')
  @ApiOperation({ summary: 'Obtener mensajes de panel `Mensajes`' })
  @ApiBearerAuth('Authorization')
  getAllMessages(@Req() req) {
    return this.messageService.getAllMessages(req);
  }

  @Get('/all/:id')
  @ApiOperation({ summary: 'Obtener mensajes con usuario específico' })
  @ApiBearerAuth('Authorization')
  getAllMessagesWith(@Req() req, @Param('id') id: number) {
    return this.messageService.getAllMessagesWith(req, id);
  }
}

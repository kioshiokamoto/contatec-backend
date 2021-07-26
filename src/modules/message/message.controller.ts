/* istanbul ignore file */
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/all')
  getAllMessages(@Req() req) {
    return this.messageService.getAllMessages(req);
  }

  @Get('/all/:id')
  getAllMessagesWith(@Req() req, @Param('id') id: number) {
    return this.messageService.getAllMessagesWith(req, id);
  }
}

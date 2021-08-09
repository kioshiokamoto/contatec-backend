import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AcceptPropose {
  @ApiProperty({
    description: 'Id de mensaje',
    example: 1,
    type: Number,
  })
  @IsNumber()
  id_mensaje: number;
}

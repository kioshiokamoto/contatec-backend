import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Estado } from '../enum/estado';

export class UpdateWork {
  @ApiProperty({
    description: 'Estado de pago',
    example: true,
    default: false,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  trb_cancelado: boolean;

  @ApiProperty({
    description: 'Estado de pago',
    example: 'Contratado' as Estado,
    enum: Estado,
    required: false,
  })
  @IsOptional()
  trb_estado: Estado;

  @ApiProperty({
    description: 'Id de pago',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  id_pago: number;
}

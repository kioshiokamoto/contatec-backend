import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Estado } from '../enum/estado';

export class UpdateWork {
  @ApiProperty({
    description: 'Estado de pago',
    example: true,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  trb_cancelado: boolean;

  @ApiProperty({
    description: 'Estado de pago',
    example: 'Contratado' as Estado,
    enum: Estado,
  })
  @IsOptional()
  trb_estado: Estado;

  @ApiProperty({
    description: 'Id de pago',
    example: 1,
    type: Number,
  })
  @IsOptional()
  id_pago: number;
}

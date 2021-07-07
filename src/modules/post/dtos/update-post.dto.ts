import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base.dto';

export class UpdatePostDTO extends BaseDto {
  @ApiProperty({
    description: 'Estado de post',
    example: true,
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  pst_isActive: boolean;

  @ApiProperty({
    description: 'Descripcion de servicio',
    example: 'Arreglo computadoras',
    type: String,
  })
  @IsOptional()
  @IsString()
  pst_descripcion: string;

  @ApiProperty({
    description: 'Costo de servicio',
    example: 180,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  pst_precioBase: number;

  @ApiProperty({
    description: 'Descripcion de servicio',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  pst_categoria: number;
}

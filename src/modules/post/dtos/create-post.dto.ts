import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseDto } from './base.dto';

export class CrearPostDTO extends BaseDto {
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
  @IsString()
  @Length(10, 150)
  pst_descripcion: string;

  @ApiProperty({
    description: 'Descripcion de servicio',
    example: 1,
    type: Number,
  })
  @IsNumber()
  pst_categoria: number;

  @ApiProperty({
    description: 'Costo de servicio',
    example: 180,
    type: Number,
  })
  @IsNumber()
  pst_precioBase: number;
}

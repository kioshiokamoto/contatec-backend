import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
    example: 'Arreglo computadoras en el cual se seguiran procesos estrictos',
    type: String,
  })
  @IsString()
  @Length(10, 250)
  pst_descripcion: string;

  @ApiProperty({
    description: 'Descripcion corta de servicio',
    example: 'Arreglo computadoras',
    type: String,
  })
  @IsString()
  @Length(10, 250)
  pst_descripcion_corta: string;

  @ApiProperty({
    description: 'Nombre de servicio',
    example: 'Arreglo computadoras',
    type: String,
  })
  @IsString()
  @Length(10, 250)
  pst_nombre: string;

  @ApiProperty({
    description: 'Servicio incluye',
    example: ['Revision', 'Mantenimiento', 'Garantia'],
    type: Array,
  })
  @IsArray()
  pst_descripcion_incluye: string[];

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

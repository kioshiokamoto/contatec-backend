import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDTO {
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
    description: 'Imagen de servicio',
    example:
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    type: String,
  })
  @IsOptional()
  @IsString()
  pst_imagen_1: string;

  @ApiProperty({
    description: 'Imagen de servicio',
    example:
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    type: String,
  })
  @IsOptional()
  @IsString()
  pst_imagen_2: string;

  @ApiProperty({
    description: 'Imagen de servicio',
    example:
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    type: String,
  })
  @IsOptional()
  @IsString()
  pst_imagen_3: string;

  @ApiProperty({
    description: 'Imagen de servicio',
    example:
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    type: String,
  })
  @IsOptional()
  @IsString()
  pst_imagen_4: string;

  @ApiProperty({
    description: 'Imagen de servicio',
    example:
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    type: String,
  })
  @IsOptional()
  @IsString()
  pst_imagen_5: string;

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

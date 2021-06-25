import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CategoriaDTO {
  @ApiProperty({
    description: 'Tipo de oficio',
    example: 'Electrónica',
    type: String,
  })
  @IsString()
  cat_nombre: string;

  @ApiProperty({
    description: 'Descripción de oficio',
    example: 'Mantenimiento de cableado eléctrico',
    type: String,
  })
  @IsOptional()
  @IsString()
  cat_descripcion: string;
}

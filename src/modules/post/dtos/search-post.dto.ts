import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class SearchPostDto {
  @ApiProperty({
    description: 'Nombre de servicio a solicitar',
    example: 'Arreglar computadoras',
    type: String,
  })
  @IsOptional()
  @IsString()
  nombre_post: string;

  @ApiProperty({
    description: 'Categoria que pertenece servicio',
    example: 'Mantenimiento',
    type: String,
  })
  @IsOptional()
  @IsString()
  categoria_post: string;
}

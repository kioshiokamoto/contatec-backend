import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReview {
  @ApiProperty({
    description: 'Calificacion de servicio (del uno al cinco)',
    example: 5,
    type: Number,
  })
  @IsNumber()
  rw_score: number;

  @ApiProperty({
    description: 'Comentario de servicio',
    example: 'Buen servicio',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  rw_comentario: string;

  // @ApiProperty({
  //   description: 'Id de usuario',
  //   example: 5,
  //   type: Number,
  // })
  // @IsNumber()
  // rw_idUsuario: number;

  @ApiProperty({
    description: 'ID de post a calificar',
    example: 5,
    type: Number,
  })
  @IsNumber()
  rw_idPost: number;
}

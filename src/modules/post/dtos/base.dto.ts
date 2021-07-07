import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class BaseDto {
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
}

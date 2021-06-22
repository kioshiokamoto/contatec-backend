import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'Doe',
    type: String,
  })
  us_nombre?: string;

  @ApiProperty({
    description: 'Apellido de usuario',
    example: 'Doe',
    type: String,
  })
  us_apellido?: string;

  @ApiProperty({
    description: 'Contraseña de usuario',
    example: '123456',
    minLength: 6,
    type: String,
  })
  password?: string;

  @ApiProperty({
    description: 'Enlace de imagen de usuario',
    example: 'https://christiantola.me/assets/img/nest_logo.d11da205.svg',
    type: String,
  })
  avatar?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Dirección de correo electrónico',
    example: 'johndoe@email.com',
    type: String,
  })
  @IsEmail(undefined, {
    message: 'Debe ser una dirección de correo electrónico válida',
  })
  @Length(1, 255, { message: 'El correo electrónico está vacío' })
  us_correo: string;

  @ApiProperty({
    description: 'Contraseña de usuario',
    example: '123456',
    minLength: 6,
    type: String,
  })
  @Length(6, 255, { message: 'Contraseña debe tener al menos 6 caracteres' })
  password: string;
}

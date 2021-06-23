import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
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
    description: 'Nombre de usuario',
    example: 'Doe',
    type: String,
  })
  @Length(3, 255, { message: 'nombre debe tener al menos 3 caracteres' })
  @IsString()
  us_nombre: string;

  @ApiProperty({
    description: 'Apellido de usuario',
    example: 'Doe',
    type: String,
  })
  @Length(3, 255, { message: 'Apellido debe tener al menos 3 caracteres' })
  @IsString()
  us_apellido: string;

  @ApiProperty({
    description: 'Contraseña de usuario',
    example: '123456',
    minLength: 6,
    type: String,
  })
  @Length(6, 255, { message: 'Contraseña debe tener al menos 6 caracteres' })
  @IsString()
  password: string;
}

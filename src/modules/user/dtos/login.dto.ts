import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsEmail(undefined, {
    message: 'Debe ser una dirección de correo electrónico válida',
  })
  @Length(1, 255, { message: 'El correo electrónico está vacío' })
  us_correo: string;

  @Length(6, 255, { message: 'Contraseña debe tener al menos 6 caracteres' })
  password: string;
}

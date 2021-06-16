import { Length } from 'class-validator';

export class ResetPasswordDto {
  @Length(6, 255, { message: 'Contraseña debe tener al menos 6 caracteres' })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Dirección de coorreo electrónico',
    example: 'johndoe@email.com',
    type: String,
  })
  @IsEmail(undefined, {
    message: 'Debe ser una dirección de correo electrónico válida',
  })
  @Length(1, 255, { message: 'El correo electrónico está vacío' })
  us_correo: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ActivateEmailDto {
  @ApiProperty({
    description: 'Token de activacion',
    example: '+NfexampleLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3',
    type: String,
  })
  @Length(3, 500, { message: 'Debe ingresar un token válido' })
  @IsString()
  activation_token: string;
}

import { IsString, Length } from 'class-validator';

export class ActivateEmailDto {
  @Length(3, 255, { message: 'Debe ingresar un token válido' })
  @IsString()
  activation_token: string;
}

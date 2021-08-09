import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, Length, Min } from 'class-validator';

export class PayServiceNow {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'Doe',
    type: String,
  })
  @Length(3, 255, { message: 'nombre debe tener al menos 3 caracteres' })
  @IsString()
  pgo_nombre: string;

  @ApiProperty({
    description: 'Apellido de usuario',
    example: 'Doe',
    type: String,
  })
  @Length(3, 255, { message: 'Apellido debe tener al menos 3 caracteres' })
  @IsString()
  pgo_apellido: string;

  @ApiProperty({
    description: 'DNI de usuario',
    example: '74444811',
    type: String,
  })
  @Length(8, 255, { message: 'DNI debe tener al menos 8 caracteres' })
  @IsString()
  pgo_dni: string;

  @ApiProperty({
    description: 'Dirección de usuario',
    example: 'Doe',
    type: String,
  })
  @Length(3, 255, { message: 'Apellido debe tener al menos 3 caracteres' })
  @IsString()
  pgo_direccion: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico',
    example: 'johndoe@email.com',
    type: String,
  })
  @IsEmail(undefined, {
    message: 'Debe ser una dirección de correo electrónico válida',
  })
  pgo_correo: string;

  @ApiProperty({
    description: 'Monto a pagar',
    example: 1000,
    type: Number,
  })
  @Min(1)
  @IsNumber()
  pgo_monto: number;

  @ApiProperty({
    description: 'Trabajo/Servicio a pagar',
    example: 51,
    type: Number,
  })
  @IsNumber()
  pgo_trabajoId: number;

  @ApiProperty({
    description: 'Numero telefónico',
    example: '970794009',
    type: String,
  })
  @Length(9, 255, { message: 'Teléfono debe tener al menos 9 caracteres' })
  @IsString()
  pgo_telefono: string;

  @ApiProperty({
    description: 'Token culqi',
    example: 'tkn_test_xxxxxxxxxxxxxxxx',
    type: String,
  })
  @IsString()
  pgo_token_culqi: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FacebookLoginDto {
  @ApiProperty({
    description: 'Token de usuario',
    example: '+NfexampleLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3',
    type: String,
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Id de usuario',
    example: '9842132161',
    type: String,
  })
  @IsString()
  userID: string;
}

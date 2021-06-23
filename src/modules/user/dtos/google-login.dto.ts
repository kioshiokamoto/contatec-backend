import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Token de usuario',
    example: '+NfexampleLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3',
    type: String,
  })
  @IsString()
  tokenId: string;
}

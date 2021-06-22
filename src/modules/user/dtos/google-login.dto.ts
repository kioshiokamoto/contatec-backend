import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Token de usuario',
    example: '+NfexampleLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3+NfLs~_ej7qE+pfz}3',
    type: String,
  })
  tokenId: string;
}

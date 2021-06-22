import { ApiProperty } from '@nestjs/swagger';

export class FacebookLoginDto {
  accessToken: string;

  userID: string;
}

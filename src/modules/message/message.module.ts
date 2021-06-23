import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [UserModule],
  providers: [MessageGateway],
})
export class MessageModule {}

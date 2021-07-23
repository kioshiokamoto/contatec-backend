/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Mensaje from 'src/entity/mensaje.entity';
import { UserModule } from '../user/user.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Mensaje])],
  providers: [MessageGateway],
})
export class MessageModule {}

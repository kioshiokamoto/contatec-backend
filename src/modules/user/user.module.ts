import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Usuario from 'src/entity/usuario.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

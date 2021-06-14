import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('/activation')
  activateEmail() {}

  @Post('/login')
  login() {}

  @Post('/refresh_token')
  getAccessToken() {}
}

import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ActivateEmailDto, CreateUserDto, LoginDto } from './dtos/';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('/activation')
  activateEmail(@Body() dto: ActivateEmailDto) {
    return this.userService.activateEmail(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.userService.login(dto, res);
  }

  @Post('/refresh_token')
  getAccessToken(@Req() req: Request) {
    return this.userService.getAccessToken(req);
  }
}

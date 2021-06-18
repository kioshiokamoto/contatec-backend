import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  ActivateEmailDto,
  CreateUserDto,
  FacebookLoginDto,
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  ResetPasswordDto,
} from './dtos/';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, description: 'Se envio correo' })
  @ApiResponse({ status: 409, description: 'Ocurrio un conflicto' })
  @Post('/register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('/activation')
  activateEmail(@Body() dto: ActivateEmailDto) {
    return this.userService.activateEmail(dto);
  }
  @Post('/forgot')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto);
  }
  @Post('/reset')
  resetPassword(@Req() req: Request, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req);
  }

  @Post('/login')
  login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.userService.login(dto, res);
  }

  @Post('/refresh_token')
  getAccessToken(@Req() req: Request) {
    return this.userService.getAccessToken(req);
  }
  @Post('/google_login')
  googleLogin(@Body() dto: GoogleLoginDto, @Res() res: Response) {
    this.userService.googleLogin(dto, res);
  }
  @Post('/facebook_login')
  facebookLogin(@Body() dto: FacebookLoginDto, @Res() res: Response) {
    this.userService.facebookLogin(dto, res);
  }
}

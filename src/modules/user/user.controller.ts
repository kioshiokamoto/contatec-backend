import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';
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
  //Inicio de sesión
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

  @ApiHeader({
    name: 'Authorization',
    description: 'Token de usuario',
  })
  @Post('/reset')
  resetPassword(@Req() req: Request, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req);
  }

  @Post('/login')
  login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.userService.login(dto, res);
  }

  @Get('/refresh_token')
  getAccessToken(@Req() req: Request) {
    return this.userService.getAccessToken(req);
  }
  @Post('/google_login')
  googleLogin(@Body() dto: GoogleLoginDto, @Res() res: Response) {
    return this.userService.googleLogin(dto, res);
  }
  @Post('/facebook_login')
  facebookLogin(@Body() dto: FacebookLoginDto, @Res() res: Response) {
    return this.userService.facebookLogin(dto, res);
  }

  @Get('/logout')
  logout(@Res() res: Response) {
    return this.userService.logout(res);
  }
  //Datos de usuario
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de usuario',
  })
  @Get('/info')
  getUserInfo(@Req() req: Request) {
    return this.userService.getUserInfo(req);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Token de usuario',
  })
  @Patch('/update')
  updateUser(@Body() dto: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(dto, req);
  }
}

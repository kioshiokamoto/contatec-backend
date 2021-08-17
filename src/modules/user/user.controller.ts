import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  ActivateEmailDto,
  CreateUserDto,
  FacebookLoginDto,
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './dtos/';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //Inicio de sesión
  @Post('/register')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({ status: 201, description: 'Se envio correo' })
  @ApiResponse({ status: 409, description: 'Ocurrio un conflicto' })
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('/activation')
  @ApiOperation({ summary: 'Activacion de usuario' })
  activateEmail(@Body() dto: ActivateEmailDto) {
    return this.userService.activateEmail(dto);
  }

  @Post('/forgot')
  @ApiOperation({ summary: 'Solicitar token de reseteo de contraseña' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto);
  }

  @Post('/reset')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Cambiar contraseña de usuario' })
  resetPassword(@Req() req: Request, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.userService.login(dto, res);
  }

  @Post('/refresh_token')
  @ApiOperation({ summary: 'Obtener access token' })
  getAccessToken(@Req() req: Request) {
    return this.userService.getAccessToken(req);
  }
  @Post('/google_login')
  @ApiOperation({ summary: 'Iniciar sesión con google' })
  googleLogin(@Body() dto: GoogleLoginDto, @Res() res: Response) {
    return this.userService.googleLogin(dto, res);
  }
  @Post('/facebook_login')
  @ApiOperation({ summary: 'Iniciar sesión con facebook' })
  facebookLogin(@Body() dto: FacebookLoginDto, @Res() res: Response) {
    return this.userService.facebookLogin(dto, res);
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  logout(@Res() res: Response) {
    return this.userService.logout(res);
  }

  @Get('/info')
  @ApiOperation({ summary: 'Obtener información de usuario' })
  @ApiBearerAuth('Authorization')
  getUserInfo(@Req() req: Request) {
    return this.userService.getUserInfo(req);
  }

  @Get('/info/:id')
  @ApiOperation({ summary: 'Obtener información de usuario por id' })
  @ApiBearerAuth('Authorization')
  getUserInfoById(@Req() req: Request, @Param() param: number) {
    return this.userService.getUserInfoById(req, param);
  }

  @Patch('/update')
  @ApiOperation({ summary: 'Actualizar información de usuario' })
  @ApiBearerAuth('Authorization')
  updateUser(@Body() dto: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(dto, req);
  }
}

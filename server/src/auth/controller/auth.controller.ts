import {Body, Controller, Get, Post, Redirect, Request, UseGuards} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {LocalAuthGuard} from '../guards/local-auth.guard';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {GoogleOAuthGuard} from '../guards/google-oauth.guard';
import {CreateUserDto} from '../../user/dto/create-user.dto';
import { Response } from 'express';
import {HttpStatus} from '@nestjs/common/enums/http-status.enum';
import {Req, Res} from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log(req);
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async auth() {

  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req);
      res.cookie(`access_token`, result, {
        maxAge: 2592000000,
        sameSite: true,
        secure: false,
      });
      console.log(result)
      return res.status(HttpStatus.OK);
    } catch (e) {
      return {
        message: 'Google login failed',
        error: e.message
      }
    }
  }
}

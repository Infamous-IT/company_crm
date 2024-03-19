import {Body, Controller, Get, Post, Redirect, Request, UseGuards} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {LocalAuthGuard} from '../guards/local-auth.guard';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';
import {GoogleOAuthGuard} from '../guards/google-oauth.guard';
import {CreateUserDto} from '../../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
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
  async googleAuth(@Request() req) {

  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  async googleAuthRedirect(@Request() req) {
    try {
      const result = await this.authService.googleLogin(req.user);
      console.log(result)
      return result;
    } catch (e) {
      return {
        message: 'Google login failed',
        error: e.message
      }
    }
  }
}

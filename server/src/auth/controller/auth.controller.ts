import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {LocalAuthGuard} from '../guards/local-auth.guard';
import {JwtAuthGuard} from '../guards/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

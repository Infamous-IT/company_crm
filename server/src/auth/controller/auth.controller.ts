import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { Req, Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login into system' })
  async login(@Request() req) {
    console.log(req);
    return await this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register to system' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout from system' })
  async logout(@Request() req, @Res() res: Response) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const userId = req.user.id;
      await this.authService.logout(token, userId);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while logging out',
        error: e.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get profile info' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Auth from google' })
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Auth from google with callback' })
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req);
      res.cookie(`access_token`, result, {
        maxAge: 2592000000,
        sameSite: true,
        secure: false,
      });
      // console.log(result)
      return res.status(HttpStatus.OK);
    } catch (e) {
      return {
        message: 'Google login failed',
        error: e.message,
      };
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Auth from facebook' })
  async facebookLogin() {}

  // when i use domain & host, i need to replace data in Facebook For Developers (website link and domain name)
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Auth from facebook with callback' })
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const result = await this.authService.facebookSSOLogin(req);

      res.cookie(`access_token`, result, {
        maxAge: 2592000000,
        sameSite: true,
        secure: false,
      });

      return res.status(HttpStatus.OK);
    } catch (e) {
      return {
        message: 'Facebook login failed',
        error: e.message,
      };
    }
  }
}

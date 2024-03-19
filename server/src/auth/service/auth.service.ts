import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {IUser} from '../../types/types';
import {CreateUserDto} from '../../user/dto/create-user.dto';
import {User} from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if(user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('Email or password was incorrect!');
  }

  async register(createUserDto: CreateUserDto): Promise<{
    user: { firstName: string; lastName: string; password: any; email: string } & User;
    token: string
  }> {
    return await this.userService.create(createUserDto);
  }

  async login(user: IUser) {
    const {id, email} = user;
    return {
      id,
      email,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email
      })
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const {email, name} = req.user;

    let user = await this.userService.findOneByEmail(email);
    const password = this.generateRandomPassword();

    if (!user) {
      const createUserDto: CreateUserDto = {
        email: email,
        firstName: name.givenName,
        lastName: name.familyName,
        password: password
      }

      return await this.userService.create(createUserDto);
    }

    return {
      message: 'User information from google',
      user: user,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email
      })
    }
  }

  generateRandomPassword(): string {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }

    const salt = 10;
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
  }
}

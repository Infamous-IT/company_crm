import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {IGoogleUser, IUser} from '../../utils/types/types';
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
    const {email, accessToken, firstName, lastName } = req.user;
    console.log(req)
    if (!accessToken) {
      return 'No user from google';
    }

    const existingUser = await this.userService.findOneByEmail(email);

    if (!existingUser) {
      const createUserDto: CreateUserDto = {
        email: email,
        firstName: firstName,
        lastName: lastName ?? '',
        password: '11111111'
      }

      return await this.userService.create(createUserDto);
    }

    return {
      message: 'User information from google',
      user: req.user,
      token: this.jwtService.sign({
        id: new Date().getTime(),
        email: email
      })
    }
  }

  async facebookSSOLogin(req) {
    const { user } = req.user;
    const { uniqueId, email, accessToken, firstName, lastName } = user;

    if (!accessToken) {
      return 'No user from facebook';
    }

    // console.log(req);

    const existingUser = await this.userService.findOneByUniqueId(uniqueId);

    if (!existingUser) {
      const createUserDto: CreateUserDto = {
        email: email,
        firstName: firstName,
        lastName: lastName ?? '',
        password: '11111111',
        uniqueId: uniqueId
      }
      // console.log(req.user.user.uniqueId);
      const newUser = await this.userService.create(createUserDto);

      // console.log(newUser);
      return {
        message: 'New user was created from Facebook!',
        user: newUser,
        token: this.jwtService.sign({
          id: new Date().getTime(),
          email: email
        })
      };
    } else {
      return {
        message: 'User information from Facebook',
        user: req.user,
        token: this.jwtService.sign({
          id: new Date().getTime(),
          email: email
        })
      }
    }
  }
}

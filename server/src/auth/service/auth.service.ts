import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {IUser} from '../../types/types';

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

  async login(user: IUser) {
    const {id, email} = user;
    return {
      id, email, token: this.jwtService.sign({
        id: user.id,
        email: user.email
      })
    }
  }
}

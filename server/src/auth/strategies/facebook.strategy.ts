import { Injectable } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from "passport-facebook";
import { isValidEmail }  from '../../regEx/valid.email';
import { generateRandomEmail } from '../../utils/generateRandomEmail';


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      scope: 'email',
      profileFields: ['emails', 'name', 'id']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void): Promise<any> {
    const {id, first_name, last_name, emails} = profile._json;

    const isEmail = isValidEmail(emails?.[0].value ?? '');

    const user = {
      email: isEmail ? emails[0].value : generateRandomEmail(),
      firstName: first_name,
      lastName: last_name,
      uniqueId: id,
      accessToken,
      refreshToken
    };

    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }

}
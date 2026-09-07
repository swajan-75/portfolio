import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { GoogleProfileInvalidException } from '../../common/exceptions/auth.exceptions';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'client_secret',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:8000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails } = profile;
    if (!Array.isArray(emails) || !emails[0]?.value) {
      throw new GoogleProfileInvalidException();
    }
    const user = {
      googleId: id,
      email: emails[0].value,
      accessToken,
    };
    done(null, user);
  }
}

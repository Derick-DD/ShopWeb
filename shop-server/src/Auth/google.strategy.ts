import { Injectable } from '@nestjs/common';
import { configService } from '../Common/Service/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import type { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configService.getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getEnv('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getEnv('APP_DOMAIN'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    done(null, profile);
  }
}

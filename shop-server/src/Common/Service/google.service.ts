// Other dependencies
import { OAuth2Client } from 'google-auth-library';
// Local files
import { configService } from './config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  googleClient = new OAuth2Client(
    configService.getEnv('GOOGLE_CLIENT_ID'),
    configService.getEnv('GOOGLE_CLIENT_SECRET'),
  );

  async verifyCredentials(credential: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
    });
    const payload = ticket.getPayload();
    return payload;
  }
}

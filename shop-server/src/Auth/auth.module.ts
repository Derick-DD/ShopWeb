// Nest dependencies
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

// Local files
import { UserEntity } from '../Entity/user.entity';
import { RedisService } from '../Common/Service/redis.service';
import { MailService } from '../Common/Service/mail.service';
import { AuthService } from './auth.service';
import { UserModule } from '../User/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { configService } from '../Common/Service/config.service';
import { GoogleStrategy } from './google.strategy';
import { GoogleService } from 'src/Common/Service/google.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          secret: configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
          signOptions: {
            ...{ expiresIn: configService.getEnv('JWT_EXPIRATION_TIME') },
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RedisService,
    MailService,
    JwtStrategy,
    GoogleStrategy,
    GoogleService,
  ],
})
export class AuthModule {}

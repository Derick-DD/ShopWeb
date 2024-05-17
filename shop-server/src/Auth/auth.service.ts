// Nest dependencies
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

// Other dependencies
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';

// Local files
import { configService } from '../Common/Service/config.service';
import { MailSenderBody } from '../Common/Types/mail';
import { MailService } from '../Common/Service/mail.service';
import { CreateAccountDto } from './Dto/create-account.dto';
import { LoginDto } from './Dto/login.dto';
import { GenerateRecoveryKeyDto } from './Dto/generate-recovery-key.dto';
import { jwtManipulationService } from '../Common/Service/jwt.manipulation.service';
import { RecoverAccountDto } from './Dto/recover-account.dto';
import { UserEntity } from '../Entity/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../Common/Service/redis.service';
import {
  ISerializeResponse,
  serializerService,
} from '../Common/Service/serializer.service';
import { ResponseMessage } from '../Common/Types/request';
import { AccessToken, CheckNameRes, GoogleUser, UserWithToken } from './auth';
import { CheckNameDto } from './Dto/check-name.dto';
import { GoogleService } from 'src/Common/Service/google.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly googleService: GoogleService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signUp(
    dto: CreateAccountDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    const existedUser: UserEntity = await this.userRepository.findOne({
      where: [
        { username: dto.username },
        { email: dto.email },
        { googleEmail: dto.googleEmail },
        { googleId: dto.googleId },
      ],
    });

    if (existedUser) throw new BadRequestException('Account already exists');
    const username = await this.redisService.getData(dto.username);
    if (username) {
      throw new BadRequestException(
        'Account is already created but not verified',
      );
    }

    const verifyToken = jwt.sign(
      {
        username: dto.username,
        email: dto.email,
        verificationToken: true,
        exp: Math.floor(Date.now() / 1000) + 120 * 60, // Token expires in 120 min
      },
      configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
    );

    const verificationUrl: string = `${configService.getEnv('APP_DOMAIN')}/account/email_verification?token=${verifyToken}`;

    const mailBody: MailSenderBody = {
      receiverEmail: dto.email,
      recieverUsername: dto.username,
      subject: `Verify Your Account [${dto.username}]`,
      text: verificationUrl,
    };

    await this.mailService.sendVerificationMail(mailBody).catch(() => {
      throw new BadRequestException('SMTP transport failed');
    });

    await this.redisService.setData(dto.username, JSON.stringify(dto), 7200);
    return serializerService.serializeResponse<ResponseMessage>('success', {
      status: 'ok',
      message:
        'Account has been created. Please verify your account to be able to sign in',
    });
  }

  async signIn(
    userEntity: UserEntity,
    rememberMe: boolean,
  ): Promise<ISerializeResponse<UserWithToken>> {
    if (userEntity.is_banned)
      throw new BadRequestException('Account is banned');
    if (!userEntity.is_active)
      throw new BadRequestException('Account is not active');

    const token: string = this.jwtService.sign({
      id: userEntity.id,
      role: userEntity.role,
      username: userEntity.username,
      email: userEntity.email,
      created_at: userEntity.created_at,
    });

    const properties: string[] = [
      'password',
      'recovery_key',
      'is_active',
      'is_banned',
    ];
    await serializerService.deleteProperties(userEntity, properties);

    if (rememberMe) {
      userEntity.refresh_token = jwt.sign(
        {
          id: userEntity.id,
          username: userEntity.username,
          iat: Date.now(),
        },
        configService.getEnv('SECRET_FOR_REFRESH_TOKEN'),
      );
      await this.userRepository.save(userEntity);
    } else {
      properties.push('refresh_token');
    }

    await serializerService.deleteProperties(userEntity, properties);

    const responseData: UserWithToken = {
      access_token: token,
      user: userEntity,
    };

    return serializerService.serializeResponse<UserWithToken>(
      'user_information',
      responseData,
    );
  }

  async signOut(bearer: string): Promise<ISerializeResponse<ResponseMessage>> {
    const decodedToken: any = jwtManipulationService.decodeJwtToken(
      bearer,
      'all',
    );
    const user: UserEntity = await this.userRepository.findOneBy({
      username: decodedToken.username,
    });
    user.refresh_token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        iat: Date.now(),
      },
      configService.getEnv('SECRET_FOR_REFRESH_TOKEN'),
    );
    await this.userRepository.save(user);

    const expireDate: number = decodedToken.exp;
    const remainingSeconds: number = Math.round(expireDate - Date.now() / 1000);

    await this.redisService.setOnlyKey(bearer.split(' ')[1], remainingSeconds);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Token is killed',
    });
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<ISerializeResponse<AccessToken>> {
    let decodedToken: jwt.JwtPayload | string;
    try {
      decodedToken = jwt.verify(
        refreshToken,
        configService.getEnv('SECRET_FOR_REFRESH_TOKEN'),
      );
      if (typeof decodedToken === 'string') {
        throw new BadRequestException('Token signature is not valid');
      }
    } catch (error) {
      throw new BadRequestException('Token signature is not valid');
    }

    let user: UserEntity;

    try {
      user = await this.userRepository.findOneBy({
        username: decodedToken.username,
        refresh_token: refreshToken,
      });
      if (!user) {
        throw new BadRequestException('Refresh token is not valid');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token is not valid');
    }

    const refreshedToken = this.jwtService.sign({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    });

    return serializerService.serializeResponse<AccessToken>(
      'refreshed_access_token',
      {
        access_token: refreshedToken,
      },
    );
  }

  async validateUser(dto: LoginDto): Promise<UserEntity> {
    let user: UserEntity;
    try {
      user = await this.userRepository.findOne({
        where: [
          {
            email: dto.email,
          },
          {
            username: dto.username,
          },
        ],
      });
      if (!user) {
        throw new BadRequestException(
          'Account does not exists or not verified yet',
        );
      }
    } catch (err) {
      throw new BadRequestException(
        'Account does not exists or not verified yet',
      );
    }

    let isVerified: boolean;
    try {
      isVerified = await argon2.verify(user.password, dto.password);
    } catch {
      throw new BadRequestException(
        'Password check error, please update your password',
      );
    }

    if (!isVerified) {
      throw new BadRequestException('Incorrect password');
    }

    return user;
  }

  async generateRecoveryKey(
    dto: GenerateRecoveryKeyDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let account: UserEntity;

    try {
      account = await this.userRepository.findOneBy({ email: dto.email });
      if (!account) {
        throw new NotFoundException('User not found by given email');
      }
    } catch (err) {
      throw new NotFoundException('User not found by given email');
    }

    if (account.is_banned) throw new BadRequestException('Account is banned');
    if (!account.is_active)
      throw new BadRequestException('Account is not active');

    const generatedKey = uuid().substring(0, 6);
    account.recovery_key = generatedKey;
    await this.userRepository.save(account);

    const mailBody: MailSenderBody = {
      receiverEmail: dto.email,
      recieverUsername: account.username,
      subject: `Account Recovery [${account.username}]`,
      text: generatedKey,
    };

    await this.mailService.sendRecoveryMail(mailBody).catch(() => {
      throw new BadRequestException('SMTP transport failed');
    });

    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Recovery key has been sent to email address',
    });
  }

  async recoverAccount(
    dto: RecoverAccountDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    try {
      const user = await this.userRepository.findOneBy({ email: dto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    } catch {
      throw new NotFoundException('User not found');
    }

    let account: UserEntity;
    try {
      account = await this.userRepository.findOneBy({
        email: dto.email,
        recovery_key: dto.recoveryKey,
      });
      if (!account) {
        throw new NotFoundException('Recovery key does not match');
      }
    } catch (error) {
      throw new BadRequestException('Recovery key does not match');
    }
    account.password = await argon2.hash(dto.password);
    account.recovery_key = '';

    await this.userRepository.save(account);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Password has been successfully updated',
    });
  }

  async accountVerification(
    incToken: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let decodedToken: string | jwt.JwtPayload;
    try {
      decodedToken = jwt.verify(
        incToken,
        configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
      );
      if (typeof decodedToken === 'string') {
        throw new BadRequestException('Token signature is not valid1');
      }
    } catch (error) {
      throw new BadRequestException('Token signature is not valid2');
    }

    if (decodedToken.verificationToken && decodedToken.username) {
      const remainingTime: number =
        decodedToken.exp - Math.floor(Date.now() / 1000);
      if (remainingTime <= 0) {
        throw new BadRequestException(
          'Verification token is no longer valid, it is expired',
        );
      }

      const accountInformation: CreateAccountDto = JSON.parse(
        await this.redisService.getData(decodedToken.username),
      );
      if (!accountInformation)
        throw new NotFoundException('Account could not found');

      const newUser: UserEntity = this.userRepository.create({
        email: accountInformation.email,
        username: accountInformation.username,
        password: await argon2.hash(accountInformation.password),
      });

      if (accountInformation.googleId) {
        newUser.googleId = accountInformation.googleId;
        newUser.googleEmail = accountInformation.googleEmail;
      }

      try {
        await this.userRepository.save(newUser);
      } catch (error) {
        throw new UnprocessableEntityException(error.errmsg);
      }
      await this.redisService.deleteData(decodedToken.username);
      return serializerService.serializeResponse('successMsg', {
        status: 'ok',
        message: 'Account has been verified',
      });
    }

    throw new BadRequestException('Token is not valid');
  }

  async checkName(dto: CheckNameDto) {
    const username = dto.username;
    const user: UserEntity = await this.userRepository.findOneBy({ username });
    const res: CheckNameRes = {
      used: false,
    };
    if (user) {
      res.used = true;
    }
    return serializerService.serializeResponse('checkName', res);
  }

  async googleSignIn(credential: string) {
    const payload = await this.googleService.verifyCredentials(credential);
    try {
      console.log(payload);
      const user: UserEntity = await this.userRepository.findOne({
        where: {
          googleEmail: payload.email,
        },
      });
      if (!user) {
        return serializerService.serializeResponse<GoogleUser>(
          'noGoogleAlert',
          {
            ifExists: false,
          },
        );
      }
      const userSignInfo = (await this.signIn(user, false)).attributes;
      return serializerService.serializeResponse<GoogleUser>('googleSign', {
        ifExists: false,
        ...userSignInfo,
      });
    } catch (err) {
      throw new BadRequestException(
        'Google Sign in failed, please try again later',
      );
    }
  }
}

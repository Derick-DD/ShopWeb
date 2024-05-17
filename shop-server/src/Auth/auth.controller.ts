// Nest dependencies
import {
  Controller,
  Headers,
  Post,
  Body,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// Other dependencies
import { RateLimit } from 'nestjs-rate-limiter';

// Local files
import { AuthService } from './auth.service';
import { CreateAccountDto } from './Dto/create-account.dto';
import { LoginDto } from './Dto/login.dto';
import { GenerateRecoveryKeyDto } from './Dto/generate-recovery-key.dto';
import { RecoverAccountDto } from './Dto/recover-account.dto';
import {
  ISerializeResponse,
  serializerService,
} from '../Common/Service/serializer.service';
import { ResponseMessage } from '../Common/Types/request';
import { UserEntity } from '../Entity/user.entity';
import { AccessToken, CheckNameRes, UserWithToken } from './auth';
import { Public } from '../Common/Decorators/public.decorator';
import { CheckNameDto } from './Dto/check-name.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @RateLimit({
    points: 5,
    duration: 300,
    errorMessage:
      'You have reached the limit of login requests. You have to wait 5 minutes before trying again.',
  })
  @Post('signin')
  async signIn(
    @Body() dto: LoginDto,
    // @Res({ passthrough: true }) res: any,
  ): Promise<ISerializeResponse<UserWithToken>> {
    const user: UserEntity = await this.authService.validateUser(dto);
    const authResponse: ISerializeResponse<UserWithToken> =
      await this.authService.signIn(user, dto.rememberMe);
    // const refreshToken = authResponse.attributes.user.refresh_token;
    // delete authResponse.attributes.user.refresh_token;
    // if (dto.rememberMe) {
    //   res.cookie('rt', refreshToken, {
    //     domain: `${configService.getEnv('APP_DOMAIN').split('//')[1]}`,
    //     path: '/api/auth/refresh-token',
    //     httpOnly: true,
    //     secure: true,
    //   });
    // }
    return authResponse;
  }

  @Public()
  @RateLimit({
    points: 1,
    duration: 120,
    errorMessage:
      'You have reached the limit. You have to wait 2 minutes before trying again.',
  })
  @Post('signup')
  signUp(
    @Body() dto: CreateAccountDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @Get('signout')
  async signOut(
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.authService.signOut(bearer);
  }

  @Public()
  @RateLimit({
    points: 3,
    duration: 300,
    errorMessage:
      'You have reached the limit. You have to wait 5 minutes before trying again.',
  })
  @Patch('generate-recovery-key')
  generateRecoveryKey(
    @Body() dto: GenerateRecoveryKeyDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.authService.generateRecoveryKey(dto);
  }

  @Public()
  @RateLimit({
    points: 3,
    duration: 300,
    errorMessage:
      'You have reached the limit. You have to wait 5 minutes before trying again.',
  })
  @Patch('recover-account')
  recoverAccount(
    @Body() dto: RecoverAccountDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.authService.recoverAccount(dto);
  }

  @Public()
  @RateLimit({
    points: 3,
    duration: 300,
    errorMessage:
      'You have reached the limit. You have to wait 5 minutes before trying again.',
  })
  @Get('account-verification')
  accountVerification(
    @Query('token') token: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.authService.accountVerification(token);
  }

  @ApiBearerAuth()
  @Get('check-token')
  async checkJwtToken(): Promise<ISerializeResponse<ResponseMessage>> {
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Token is valid',
    });
  }

  @Public()
  @Get('refresh-token')
  async refreshJwtToken(
    @Query('refreshToken') refreshToken: string,
  ): Promise<ISerializeResponse<AccessToken>> {
    return await this.authService.refreshToken(refreshToken);
  }

  @Public()
  @ApiBearerAuth()
  @Post('check-name')
  async checkName(
    @Body() dto: CheckNameDto,
  ): Promise<ISerializeResponse<CheckNameRes>> {
    return await this.authService.checkName(dto);
  }

  @Public()
  @Post('google')
  async googleSignIn(@Body() dto: { credential: string }) {
    return await this.authService.googleSignIn(dto.credential);
  }
}

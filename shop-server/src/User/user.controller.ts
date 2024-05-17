// Nest dependencies
import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  Headers,
  Query,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// Other dependencies
import { RateLimit } from 'nestjs-rate-limiter';

// Local files
import { jwtManipulationService } from '../Common/Service/jwt.manipulation.service';
import { UserService } from './user.service';
import { UpdateUserDto } from './Dto/update-user.dto';
import { ActivateUserDto } from './Dto/activate-user.dto';
import { Roles } from '../Common/Decorators/roles.decorator';
import { Role } from '../Common/Enums/Roles';
import { UserBanDto } from './Dto/user-ban.dto';
import { ISerializeResponse } from '../Common/Service/serializer.service';
import { UserEntity } from '../Entity/user.entity';
import { CreateUserDto } from './Dto/create-user.dto';
import { DeleteUserDto } from './Dto/delete-user.dto';
import { UserInfo, UserAvatar } from './user';
import { ResponseMessage } from '../Common/Types/request';
import { Public } from '../Common/Decorators/public.decorator';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get(':username')
  getUser(@Param('username') username): Promise<ISerializeResponse<UserInfo>> {
    return this.usersService.getUser(username);
  }

  // @Get('search')
  // searchUserByUsername(
  //   @Query('searchValue') searchValue: string,
  // ): Promise<UserEntity[]> {
  //   return this.usersService.searchUserByUsername({ searchValue });
  // }

  @ApiBearerAuth()
  @RateLimit({
    points: 3,
    duration: 60,
    errorMessage:
      'You have reached the limit. You have to wait 60 seconds before trying again',
  })
  @Put('avatar')
  @Roles(Role.User)
  uploadProfileImage(
    @Headers('authorization') bearer: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<ISerializeResponse<UserAvatar>> {
    const username = jwtManipulationService.decodeJwtToken(bearer, 'username');

    return this.usersService.uploadProfileImage(username, file);
  }

  @ApiBearerAuth()
  @Delete('avatar')
  @Roles(Role.User)
  deleteProfileImage(
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.deleteProfileImage(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @RateLimit({
    points: 10,
    duration: 60,
    errorMessage:
      'You have reached the limit. You have to wait 60 seconds before trying again',
  })
  @Patch('update')
  @Roles(Role.User)
  updateUser(
    @Body() dto: UpdateUserDto,
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<UserInfo>> {
    return this.usersService.updateUser(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
      dto,
    );
  }

  @ApiBearerAuth()
  @Patch('ban-situation')
  @Roles(Role.SuperAdmin)
  banOrUnbanUser(
    @Headers('authorization') bearer: string,
    @Body() dto: UserBanDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.banOrUnbanUser(
      jwtManipulationService.decodeJwtToken(bearer, 'role'),
      dto.username,
      dto.banSituation,
    );
  }

  @Public()
  @RateLimit({
    points: 3,
    duration: 300,
    errorMessage:
      'You have reached the limit. You have to wait 5 minutes before trying again',
  })
  @Get('verify-updated-email')
  async verifyUpdatedEmail(
    @Query('token') token: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.verifyUpdatedEmail(token);
  }

  @ApiBearerAuth()
  @Patch('disable')
  @Roles(Role.User)
  disableUser(
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.disableUser(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @Public()
  @RateLimit({
    points: 1,
    duration: 300,
    errorMessage: 'You can only send 1 activation mail in 5 minutes',
  })
  @Post('send-activation-mail')
  async sendActivationMail(
    @Body() dto: ActivateUserDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.sendActivationMail(dto);
  }

  @RateLimit({
    points: 3,
    duration: 300,
    errorMessage:
      'You have reached the limit. You have to wait 5 minutes before trying again',
  })
  @Roles(Role.SuperAdmin)
  @Get('activate-user')
  async activateUser(
    @Query('token') token: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.activateUser(token);
  }

  @Post('/super')
  @Roles(Role.SuperAdmin)
  async createUserForSuper(
    @Body() dto: CreateUserDto,
  ): Promise<ISerializeResponse<UserEntity>> {
    return this.usersService.createUserForSuper(dto);
  }

  @Delete('/super')
  @Roles(Role.SuperAdmin)
  async deleteUserForSuper(
    @Body() dto: DeleteUserDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.usersService.deleteUserForSuper(dto.username);
  }

  // @Get('/super')
  // async getUsers() {
  //   return this.usersService.getAllUsers();
  // }
}

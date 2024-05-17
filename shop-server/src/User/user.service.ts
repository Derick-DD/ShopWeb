// Nest dependencies
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Other dependencies
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

// Local files
import { UserEntity } from '../Entity/user.entity';
import { UpdateUserDto } from './Dto/update-user.dto';
import { MailService } from '../Common/Service/mail.service';
import { MailSenderBody } from '../Common/Types/mail';
import { ActivateUserDto } from './Dto/activate-user.dto';
import { configService } from '../Common/Service/config.service';
import { AwsService } from '../Common/Service/aws.service';
import { Repository } from 'typeorm';
import {
  ISerializeResponse,
  serializerService,
} from '../Common/Service/serializer.service';
import { CreateUserDto } from './Dto/create-user.dto';
import { UserInfo, UserAvatar } from './user';
import { ResponseMessage } from '../Common/Types/request';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailService: MailService,
    private readonly awsService: AwsService,
  ) {}

  // async getAllUsers(): Promise<UserEntity[]> {
  //   const userInfos: UserEntity[] = await this.userRepository.find();
  //   return userInfos;
  // }

  async getUser(username: string): Promise<ISerializeResponse<UserInfo>> {
    const profile: UserEntity = await this.findUserByName(username);
    const properties: string[] = [
      'password',
      'recovery_key',
      'refresh_token',
      'is_active',
      'is_banned',
    ];
    await serializerService.deleteProperties(profile, properties);

    return serializerService.serializeResponse<UserInfo>(
      'user_profile',
      profile,
    );
  }

  // async searchUserByUsername({
  //   searchValue,
  // }: {
  //   searchValue: string;
  // }): Promise<UserEntity[]> {
  //   if (searchValue.length < 3)
  //     throw new BadRequestException(
  //       'Search value must be greater than 2 characters',
  //     );
  //   try {
  //     const result: UserEntity[] = await this.userRepository.find({
  //       where: {
  //         username: new RegExp(searchValue, 'i').source,
  //       },
  //     });
  //     return result;
  //   } catch (error) {
  //     throw new NotFoundException('No result found');
  //   }
  // }

  async uploadProfileImage(
    username: string,
    file: Express.Multer.File,
  ): Promise<ISerializeResponse<UserAvatar>> {
    const user: UserEntity = await this.findUserByName(username);
    if (user.avatar !== '') {
      const imagePath: string = user.avatar.substring(
        user.avatar.lastIndexOf('/'),
      );
      this.awsService.deleteImage(imagePath, 'users');
    }
    const avatarPath: string = `${user.id}-${file.originalname}`;
    const avatar: string = this.awsService.uploadImage(
      avatarPath,
      'users',
      file,
    );
    const newUser: UserEntity = await this.userRepository.preload({
      ...user,
      avatar: avatarPath,
    });
    this.userRepository.save(newUser);
    return serializerService.serializeResponse<UserAvatar>('avatar', {
      avatar: avatar,
    });
  }

  async deleteProfileImage(
    username: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    const user: UserEntity = await this.findUserByName(username);
    this.awsService.deleteImage(user.avatar, 'users');
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Image successfully deleted',
    });
  }

  async updateUser(
    username: string,
    dto: UpdateUserDto,
  ): Promise<ISerializeResponse<UserInfo>> {
    // const profile = await this.userRepository.preload({
    //   username,
    //   ...dto,
    // });
    const profile: UserEntity = await this.findUserByName(username);

    if (dto.username) profile.username = dto.username;
    if (dto.biography) profile.biography = dto.biography;
    if (dto.password) {
      const hashedPassword = await argon2.hash(dto.password);
      if (!(await argon2.verify(profile.password, dto.oldPassword))) {
        throw new BadRequestException('Old password does not match');
      }
      profile.password = hashedPassword;
    }

    await this.userRepository.save(profile);

    if (dto.email) {
      const activateToken: string = jwt.sign(
        {
          email: profile.email,
          username: profile.username,
          newEmail: dto.email,
          verifyUpdateEmailToken: true,
          exp: Math.floor(Date.now() / 1000) + 30 * 60, // Token expires in 30 min
        },
        configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
      );

      const activationUrl = `${configService.getEnv('APP_DOMAIN')}/auth/confirmation/email?token=${activateToken}`;
      const mailBody: MailSenderBody = {
        receiverEmail: dto.email,
        recieverUsername: dto.username || profile.username,
        subject: `Verify Your New Email [${profile.username}]`,
        text: activationUrl,
      };

      await this.mailService.sendEmailUpdate(mailBody).catch(() => {
        throw new BadRequestException('SMTP transport failed');
      });
    }

    const properties: string[] = [
      'password',
      'recovery_key',
      'refresh_token',
      'is_active',
      'is_banned',
    ];
    await serializerService.deleteProperties(profile, properties);

    return serializerService.serializeResponse<UserInfo>(
      'updated_profile',
      profile,
    );
  }

  async banOrUnbanUser(
    operatorRole: number,
    username: string,
    banSituation: boolean,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    const user: UserEntity = await this.findUserByName(username);
    if (operatorRole <= user.role)
      throw new ForbiddenException('Operation not permitted');

    user.is_banned = banSituation;
    await this.userRepository.save(user);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: `User ${username}'s ban situation changed to ${banSituation}`,
    });
  }

  async verifyUpdatedEmail(
    incToken: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let decodedToken: string | jwt.JwtPayload;

    try {
      decodedToken = jwt.verify(
        incToken,
        configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
      );
      if (typeof decodedToken === 'string') {
        throw new BadRequestException('Token signature is not valid');
      }
    } catch (error) {
      throw new BadRequestException('Token signature is not valid');
    }

    if (decodedToken.email === decodedToken.newEmail) {
      throw new BadRequestException('Verification token is not valid');
    }

    if (decodedToken.verifyUpdateEmailToken) {
      const remainingTime: number =
        decodedToken.exp - Math.floor(Date.now() / 1000);
      if (remainingTime <= 0) {
        throw new BadRequestException('Verification token is not valid');
      }

      try {
        const user: UserEntity = await this.userRepository.findOneBy({
          email: decodedToken.email,
          username: decodedToken.username,
        });
        user.email = decodedToken.newEmail;
        await this.userRepository.save(user);
      } catch (err) {
        throw new BadRequestException('Verification token is not valid');
      }
      return serializerService.serializeResponse<ResponseMessage>(
        'successMsg',
        {
          status: 'ok',
          message: 'Email has been updated',
        },
      );
    }

    throw new BadRequestException('Verification token is not valid');
  }

  async disableUser(
    username: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    const user: UserEntity = await this.findUserByName(username);
    user.is_active = false;
    await this.userRepository.save(user);

    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Account successfully disabled',
    });
  }

  async activateUser(
    incToken: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let decodedToken: string | jwt.JwtPayload;

    try {
      decodedToken = jwt.verify(
        incToken,
        configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
      );
      if (typeof decodedToken === 'string') {
        throw new BadRequestException('Token signature is not valid');
      }
    } catch (error) {
      throw new BadRequestException('Token signature is not valid');
    }

    if (decodedToken.activationToken) {
      const remainingTime: number =
        decodedToken.exp - Math.floor(Date.now() / 1000);
      if (remainingTime <= 0) {
        throw new BadRequestException('Activation token is not valid');
      }

      try {
        const account: UserEntity = await this.userRepository.findOneBy({
          email: decodedToken.email,
          username: decodedToken.username,
        });

        account.is_active = true;
        await this.userRepository.save(account);
      } catch (err) {
        throw new BadRequestException('Activation token is not valid');
      }
      return serializerService.serializeResponse<ResponseMessage>(
        'successMsg',
        {
          status: 'ok',
          message: 'Account has been activated',
        },
      );
    }

    throw new BadRequestException('Activation token is not valid');
  }

  async sendActivationMail(
    dto: ActivateUserDto,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let user: UserEntity;
    try {
      user = await this.userRepository.findOneBy({
        email: dto.email,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    } catch (err) {
      throw new NotFoundException('User not found');
    }

    if (user.is_banned)
      throw new BadRequestException(
        'Banned accounts can not do activation mail processes',
      );
    if (user.is_active)
      throw new BadRequestException('This account is already active');

    const activateToken: string = jwt.sign(
      {
        email: user.email,
        username: user.username,
        activationToken: true,
        exp: Math.floor(Date.now() / 1000) + 30 * 60, // Token expires in 30 min
      },
      configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
    );

    const activationUrl = `${configService.getEnv('APP_DOMAIN')}/auth/activation/user?token=${activateToken}`;
    const mailBody: MailSenderBody = {
      receiverEmail: dto.email,
      recieverUsername: user.username,
      subject: `Reactivate Your Account [${user.username}]`,
      text: activationUrl,
    };

    await this.mailService.sendAccountActivation(mailBody).catch(() => {
      throw new BadRequestException('SMTP transport failed');
    });
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Activation mail has been sent',
    });
  }

  async createUserForSuper(
    dto: CreateUserDto,
  ): Promise<ISerializeResponse<UserEntity>> {
    const existedUser = await this.userRepository.findOneBy({
      username: dto.username,
    });
    if (existedUser) {
      throw new ConflictException('Duplicate username');
    }
    const hashedPassword = await argon2.hash(dto.password);
    dto.password = hashedPassword;
    const user = await this.userRepository.save({
      ...dto,
    });
    return serializerService.serializeResponse<UserEntity>('user_detail', user);
  }

  async deleteUserForSuper(
    username: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    const user = await this.findUserByName(username);
    this.userRepository.remove(user);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'User has been removed',
    });
  }

  private async findUserByName(username: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ username });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }
}

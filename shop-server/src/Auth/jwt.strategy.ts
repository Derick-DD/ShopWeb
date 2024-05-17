// Nest dependencies
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

// Other dependencies
import { ExtractJwt, Strategy } from 'passport-jwt';

// Local files
import { configService } from '../Common/Service/config.service';
import { UserEntity } from '../Entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<any> {
    const { iat, exp, username } = payload;
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    let user: UserEntity;
    try {
      user = await this.usersRepository.findOneBy({ username });
      if (!user) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (user.is_banned) throw new BadRequestException('Account is banned');
    if (!user.is_active) throw new BadRequestException('Account is not active');

    const data = {
      user_id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };
    return data;
  }
}

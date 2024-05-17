// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  Length,
  ValidateIf,
  Matches,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: false,
    example: 'demo@demo.com',
  })
  @ValidateIf((o) => !o.username)
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    example: 'demo_user',
  })
  @Matches(/^[a-z0-9_.-]{3,17}$/, {
    message: 'Username not valid',
  })
  @ValidateIf((o) => !o.email)
  username: string;

  @ApiProperty({
    required: true,
    example: true,
  })
  @IsBoolean()
  rememberMe: boolean;

  @ApiProperty({
    required: true,
    example: 'demo123',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_\-+=]{6,20}$/, {
    message: 'Incorrect password',
  })
  @Length(6, 100)
  password: string;
}

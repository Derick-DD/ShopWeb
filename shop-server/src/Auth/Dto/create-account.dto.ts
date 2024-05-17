// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsNotEmpty,
  Length,
  Matches,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    required: true,
    example: 'demo@demo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'demo_user',
  })
  @IsNotEmpty()
  @Matches(/^[a-z0-9_.-]{3,17}$/, {
    message:
      "Username can only contain lowercase letters, numbers, '_', '-' and '.' with min 3 max 17 length",
  })
  username: string;

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

  @ApiProperty({
    example: 'demo-google-id',
  })
  @IsString()
  @IsOptional()
  googleId: string;

  @ApiProperty({
    example: 'demo@demo.com',
  })
  @IsEmail()
  @IsOptional()
  googleEmail: string;
}

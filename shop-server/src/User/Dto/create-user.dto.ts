// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsNotEmpty,
  NotContains,
  Length,
  Matches,
  IsEmail,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
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
  @NotContains(' ')
  @Length(6, 100)
  password: string;

  @ApiProperty({
    required: true,
    example: 0,
  })
  @IsIn([0, 1, 2])
  role: 0 | 1 | 2;
}

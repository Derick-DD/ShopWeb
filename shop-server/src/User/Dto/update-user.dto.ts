// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsOptional,
  Length,
  MaxLength,
  NotContains,
  IsNotEmpty,
  ValidateIf,
  IsEmail,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'Updated Name',
  })
  @IsOptional()
  @NotContains(' ')
  @Length(3, 50)
  username: string;

  @ApiProperty({
    required: false,
    example: 'updated@demo.com',
  })
  @IsOptional()
  //   @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
  //     message: 'Email must be a type of email',
  //   })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    example: 'Demo User, X Years old.',
  })
  @IsOptional()
  @MaxLength(155)
  biography: string;

  @ApiProperty({
    required: false,
    example: 'demo123',
  })
  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_\-+=]{6,20}$/, {
    message: 'Incorrect password',
  })
  @Length(6, 100)
  password: string;

  @ApiProperty({
    required: true,
    example: '123demo',
  })
  @ValidateIf((o) => o.password !== undefined)
  @IsNotEmpty()
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_\-+=]{6,20}$/, {
  //   message: 'Incorrect password',
  // })
  @Length(6, 100)
  oldPassword: string;
}

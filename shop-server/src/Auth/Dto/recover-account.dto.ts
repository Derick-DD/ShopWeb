// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';

export class RecoverAccountDto {
  @ApiProperty({
    required: true,
    example: 'demo@demo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'axg16z',
  })
  @Length(6, 6)
  @IsNotEmpty()
  recoveryKey: string;

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

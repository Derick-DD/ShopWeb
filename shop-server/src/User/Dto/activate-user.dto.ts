// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsEmail } from 'class-validator';

export class ActivateUserDto {
  @ApiProperty({
    required: true,
    example: 'updated@demo.com',
  })
  @IsEmail()
  email: string;
}

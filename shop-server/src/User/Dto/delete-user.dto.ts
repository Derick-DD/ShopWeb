// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty, Matches } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    required: true,
    example: 'demo_user',
  })
  @IsNotEmpty()
  @Matches(/^[a-z0-9_.-]{3,17}$/, {
    message: 'Username not valid',
  })
  username: string;
}

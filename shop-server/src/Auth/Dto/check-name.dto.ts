import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CheckNameDto {
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
}

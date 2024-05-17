// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsEmail } from 'class-validator';

export class GenerateRecoveryKeyDto {
  @ApiProperty({
    required: true,
    example: 'demo@demo.com',
  })
  @IsEmail()
  email: string;
}

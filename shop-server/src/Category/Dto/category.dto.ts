import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    required: true,
    example: 'Electronic',
  })
  @IsString()
  @MaxLength(50)
  readonly name: string;
}

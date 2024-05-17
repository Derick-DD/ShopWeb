import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPositive, Length, IsInt } from 'class-validator';

export class CartDto {
  @ApiProperty({
    required: true,
    example: 'example-uuid',
  })
  @IsString()
  @Length(36)
  readonly productId: string;

  @ApiProperty({
    required: true,
    example: 10,
  })
  @IsPositive()
  @IsInt()
  readonly count: number;
}

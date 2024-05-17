import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPositive,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    required: true,
    example: 'Laptop',
  })
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty({
    required: true,
    example: 'uploads/demo.jpeg',
  })
  @IsString()
  @MaxLength(255)
  readonly imagePath: string;

  @ApiProperty({
    required: true,
    example: 'Electronic',
  })
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty({
    required: true,
    example: 99.9,
  })
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    required: false,
    example: 'Demo description for a product.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  readonly description: string;
}

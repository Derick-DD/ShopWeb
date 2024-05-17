// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CartItemsDto {
  @ApiProperty({
    required: true,
    example: 'demo_uuid',
  })
  @IsString()
  @IsUUID()
  readonly productId: string;

  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  readonly count: number;
}

export class CreateOrderDto {
  @ApiProperty({
    required: true,
    example: 'demo_uuid',
  })
  @IsString()
  @IsUUID()
  readonly addressId: string;

  @ApiProperty({
    required: true,
    isArray: true,
  })
  @IsArray()
  readonly cartItems: CartItemsDto[];
}

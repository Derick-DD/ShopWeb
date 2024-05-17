import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class deleteOrderDto {
  @ApiProperty({
    required: true,
    example: ['exampleId'],
  })
  @IsArray()
  readonly orderIds: string[];
}

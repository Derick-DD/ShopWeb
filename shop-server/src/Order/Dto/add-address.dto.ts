// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class AddAddressDto {
  @ApiProperty({
    required: true,
    example: 'demo_name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    required: true,
    example: ['852-6000000', '86-13000000000'],
  })
  @IsNotEmpty()
  @Matches(
    /^852\-([6|9])\d{7}$|^86\-1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/,
    {
      message: 'Must contain a valid mailand or HK phone number',
    },
  )
  readonly phone: string;

  @ApiProperty({
    required: true,
    example: 'Avon Park',
  })
  @IsString()
  readonly addressName: string;

  @ApiProperty({
    required: true,
    example: '15 YAMing road, Fanling',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    required: true,
    example: 'NT',
  })
  @IsString()
  readonly district: string;

  @ApiProperty({
    example: 'Block 1, Floor 1, 1A',
  })
  @IsOptional()
  @IsString()
  readonly addressDetail: string;
}

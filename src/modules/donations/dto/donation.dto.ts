import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonationDto {
  @ApiProperty({
    description: 'Donation amount in the smallest unit (e.g., tinybars for HBAR)',
    minimum: 1,
    example: 100000000
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    description: 'ID of the campaign to donate to',
    example: '5f8d0f3d9d5b1d2d9c9f1d5b'
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({
    description: 'Blockchain transaction hash',
    example: '0x123...abc',
    minLength: 64,
    maxLength: 66
  })
  @IsString()
  @IsNotEmpty()
  txHash: string;
}



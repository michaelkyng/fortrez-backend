import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDonationDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  txHash: string;
}

export class DonationResponseDto {
  id: string;
  amount: number;
  campaignId: string;
  donorId: string;
  txHash: string;
  status: string;
  createdAt: Date;
}

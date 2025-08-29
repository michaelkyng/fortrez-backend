import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  goalAmount: number;

  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value as string))
  deadline: Date;
}

export class UpdateCampaignDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsNumber()
  goalAmount?: number;

  @IsDateString()
  deadline?: string;
}

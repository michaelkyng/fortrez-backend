import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Title of the campaign',
    example: 'Help build a new community center',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the campaign',
    example: 'We are raising funds to build a new community center that will serve...',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Funding goal in the smallest unit (e.g., tinybars for HBAR)',
    example: 1000000000, // 10 HBAR in tinybars
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  goalAmount: number;

  @ApiProperty({
    description: 'Campaign deadline in ISO 8601 format',
    example: '2023-12-31T23:59:59.999Z',
    required: true
  })
  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value as string))
  deadline: Date;
}

export class UpdateCampaignDto {
  @ApiPropertyOptional({
    description: 'Updated title of the campaign',
    example: 'Updated: Help build a new community center'
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the campaign',
    example: 'Updated description with more details...'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated funding goal in the smallest unit',
    example: 1500000000 // 15 HBAR in tinybars
  })
  @IsNumber()
  @IsOptional()
  goalAmount?: number;

  @ApiPropertyOptional({
    description: 'Updated campaign deadline in ISO 8601 format',
    example: '2024-01-31T23:59:59.999Z'
  })
  @IsDateString()
  @IsOptional()
  deadline?: string;
}

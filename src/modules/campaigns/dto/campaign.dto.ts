import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus, CampaignType, CampaignCategory } from '../../../interfaces';

class DeadlineDto {
  @ApiPropertyOptional({
    description: 'Deadline date in ISO 8601 format',
    example: '2023-12-31T23:59:59.999Z',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  date?: Date | null;

  @ApiPropertyOptional({
    description: 'Whether the campaign has a deadline',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasDeadline?: boolean;
}

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Title of the campaign',
    example: 'Help build a new community center',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the campaign',
    example: 'We are raising funds to build a new community center that will serve...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The problem this campaign aims to solve',
    example: 'Lack of community spaces in our neighborhood',
    required: false,
  })
  @IsString()
  @IsOptional()
  problem?: string;

  @ApiProperty({
    description: 'Proposed solutions for the problem',
    example: ['Build a community center', 'Organize local events'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  solutions?: string[];

  @ApiProperty({
    description: 'Funding goal in the smallest unit (e.g., tinybars for HBAR)',
    example: 1000000000, // 10 HBAR in tinybars
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  target: number;

  @ApiProperty({
    description: 'Deadline configuration for the campaign',
    type: DeadlineDto,
    required: false,
    default: { date: null, hasDeadline: false },
  })
  @ValidateNested()
  @Type(() => DeadlineDto)
  deadline: DeadlineDto;

  @ApiProperty({
    description: 'Category of the campaign',
    enum: CampaignCategory,
    example: CampaignCategory.COMMUNITY,
    required: true,
  })
  @IsEnum(CampaignCategory)
  @IsNotEmpty()
  category: CampaignCategory;

  @ApiProperty({
    description: 'Type of the campaign',
    enum: CampaignType,
    example: CampaignType.CREATOR,
    required: true,
  })
  @IsEnum(CampaignType)
  @IsNotEmpty()
  type: CampaignType;
}

export class UpdateCampaignDto {
  @ApiPropertyOptional({
    description: 'Updated title of the campaign',
    example: 'Updated: Help build a new community center',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the campaign',
    example: 'Updated description with more details...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The problem this campaign aims to solve',
    example: 'Updated problem statement',
  })
  @IsString()
  @IsOptional()
  problem?: string;

  @ApiPropertyOptional({
    description: 'Updated solutions for the problem',
    example: ['Updated solution 1', 'Updated solution 2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  solutions?: string[];

  @ApiPropertyOptional({
    description: 'Updated funding goal in the smallest unit',
    example: 1500000000, // 15 HBAR in tinybars
  })
  @IsNumber()
  @IsOptional()
  target?: number;

  @ApiPropertyOptional({
    description: 'Updated raised amount in the smallest unit',
    example: 500000000, // 5 HBAR in tinybars
  })
  @IsNumber()
  @IsOptional()
  raisedAmount?: number;

  @ApiPropertyOptional({
    description: 'Updated deadline configuration',
    type: DeadlineDto,
  })
  @ValidateNested()
  @Type(() => DeadlineDto)
  @IsOptional()
  deadline?: DeadlineDto;

  @ApiPropertyOptional({
    description: 'Updated category of the campaign',
    enum: CampaignCategory,
    example: CampaignCategory.COMMUNITY,
  })
  @IsEnum(CampaignCategory)
  @IsOptional()
  category?: CampaignCategory;

  @ApiPropertyOptional({
    description: 'Updated type of the campaign',
    enum: CampaignType,
    example: CampaignType.CREATOR,
  })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @ApiPropertyOptional({
    description: 'Updated status of the campaign',
    enum: CampaignStatus,
    example: CampaignStatus.ACTIVE,
  })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;
}

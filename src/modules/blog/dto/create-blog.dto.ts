import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class CreateBlogDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'Getting Started with NestJS',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional({
    description: 'URL-friendly version of the title. Will be auto-generated if not provided',
    example: 'getting-started-with-nestjs',
  })
  @IsString()
  @IsOptional()
  readonly slug?: string;

  @ApiProperty({
    description: 'The main content of the blog post in markdown format',
    example: '# Introduction\n\nThis is a blog post about...',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiPropertyOptional({
    description: 'A short excerpt or summary of the blog post',
    example: 'Learn the basics of NestJS in this comprehensive guide...',
  })
  @IsString()
  @IsOptional()
  readonly excerpt?: string;

  @ApiPropertyOptional({
    description: 'URL to the featured image of the blog post',
    example: 'https://example.com/images/featured.jpg',
  })
  @IsString()
  @IsOptional()
  readonly coverImage?: string;

  @ApiPropertyOptional({
    description: 'ID of the author (user) who created the blog post',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @ApiPropertyOptional({
    description: 'Array of tags for categorizing the blog post',
    example: ['nestjs', 'backend', 'tutorial'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly tags?: string[];

  @ApiPropertyOptional({
    description: 'Publication status of the blog post',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  @IsEnum(BlogStatus)
  @IsOptional()
  readonly status?: BlogStatus;
}

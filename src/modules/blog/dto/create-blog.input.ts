import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class CreateBlogInput {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly slug?: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsString()
  @IsOptional()
  readonly excerpt?: string;

  @IsString()
  @IsOptional()
  readonly coverImage?: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsArray()
  @IsOptional()
  readonly tags?: string[];

  @IsEnum(BlogStatus)
  @IsOptional()
  readonly status?: BlogStatus;
}

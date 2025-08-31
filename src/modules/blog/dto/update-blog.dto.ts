import { CreateBlogDto, BlogStatus } from './create-blog.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiPropertyOptional({
    description: 'The title of the blog post',
    example: 'Updated: Getting Started with NestJS',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'URL-friendly version of the title',
    example: 'updated-getting-started-with-nestjs',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'The main content of the blog post in markdown format',
    example: '# Updated Content\n\nThis is the updated content...',
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'A short excerpt or summary of the blog post',
    example: 'Updated excerpt for the blog post...',
  })
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'URL to the featured image of the blog post',
    example: 'https://example.com/images/updated-featured.jpg',
  })
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Array of tags for categorizing the blog post',
    example: ['nestjs', 'backend', 'tutorial', 'updated'],
    type: [String],
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Publication status of the blog post',
    enum: BlogStatus,
    example: BlogStatus.PUBLISHED,
  })
  status?: BlogStatus;
}

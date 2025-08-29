import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.controller';

@Module({
  providers: [BlogResolver, BlogService],
})
export class BlogModule {}

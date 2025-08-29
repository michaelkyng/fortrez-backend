import { CreateBlogInput } from './create-blog.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBlogInput extends PartialType(CreateBlogInput) {}

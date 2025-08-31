import { Controller, Get, Post, Body, Param, Patch, Delete, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from '@fortrez/schemas';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiCreatedResponse({
    description: 'The blog post has been successfully created.',
    type: Blog,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiBody({ type: CreateBlogDto })
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all blog posts',
    type: [Blog],
  })
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Blog post ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the blog post with the specified ID',
    type: Blog,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog post not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Blog post ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blog post has been successfully updated',
    type: Blog,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog post not found',
  })
  @ApiBody({ type: UpdateBlogDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Blog post ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blog post has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Blog post not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogService.remove(id);
  }
}

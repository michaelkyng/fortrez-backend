import { Controller, Post, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/campaign.dto';
import { Campaign } from '@fortrez/schemas';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The campaign has been successfully created.',
    type: Campaign,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.service.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all campaigns',
    type: [Campaign],
  })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the campaign to retrieve',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the campaign with the specified ID',
    type: Campaign,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Campaign not found',
  })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}

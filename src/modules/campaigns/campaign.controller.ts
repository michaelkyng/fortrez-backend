import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/campaign.dto';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  @Post('create')
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.service.create(createCampaignDto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}

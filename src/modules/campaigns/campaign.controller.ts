import { Controller, Post, Body, Get, Param, HttpStatus, Request } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { Campaign, Donation } from 'src/schemas';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Delete, Patch, UseGuards } from '@nestjs/common/decorators';
import { CreateDonationDto } from '../donations/dto/donation.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtRequest, UserRole } from 'src/interfaces';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly service: CampaignService) {}

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update campaign by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the campaign to update',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign updated successfully',
    type: Campaign,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Campaign not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.service.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete campaign by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the campaign to delete',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Campaign not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new donation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The donation has been successfully created.',
    type: Donation,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async donate(
    @Param('campaignId') campaignId: string,
    @Body() createDonationDto: CreateDonationDto,
    @Request() req: JwtRequest,
  ) {
    const donation = {
      ...createDonationDto,
      donor: req.user.userId,
      campaign: campaignId,
    };
    return this.service.updateRaisedAmount(
      donation.campaign,
      donation.amount,
      donation.txHash,
      donation.donor,
      donation.status,
    );
  }
}

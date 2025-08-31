import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDonationDto } from './dto/donation.dto';
import { JwtRequest } from '@fortrez/interfaces';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Donation } from '@fortrez/schemas';

@ApiTags('donations')
@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  async create(
    @Body() createDonationDto: CreateDonationDto,
    @Request() req: JwtRequest,
  ) {
    const donation = {
      ...createDonationDto,
      donor: req.user.userId,
      campaign: createDonationDto.campaignId,
    };
    return this.donationService.create(donation);
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get all donations for a specific campaign' })
  @ApiParam({
    name: 'campaignId',
    required: true,
    description: 'ID of the campaign',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all donations for the specified campaign',
    type: [Donation],
  })
  async findByCampaign(@Param('campaignId') campaignId: string) {
    return this.donationService.findByCampaign(campaignId);
  }

  @Get('donor/:donorId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all donations by a specific donor' })
  @ApiParam({
    name: 'donorId',
    required: true,
    description: 'ID of the donor',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all donations made by the specified donor',
    type: [Donation],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findByDonor(@Param('donorId') donorId: string) {
    return this.donationService.findByDonor(donorId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDonationDto } from './dto/donation.dto';
import { JwtRequest } from '../common/interfaces/request';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  async findByCampaign(@Param('campaignId') campaignId: string) {
    return this.donationService.findByCampaign(campaignId);
  }

  @Get('donor/:donorId')
  @UseGuards(JwtAuthGuard)
  async findByDonor(@Param('donorId') donorId: string) {
    return this.donationService.findByDonor(donorId);
  }
}

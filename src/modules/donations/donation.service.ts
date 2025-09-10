import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from '../../schemas';
import { DonationStatus } from '../../interfaces';
import { CampaignService } from '../campaigns/campaign.service';
import { CreateDonationDto } from './dto/donation.dto';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private campaignService: CampaignService,
  ) {}

  async findById(id: string): Promise<Donation | null> {
    return this.donationModel.findById(id).populate('donor').populate('campaign').exec();
  }

  async findByCampaign(campaignId: string): Promise<Donation[]> {
    return this.donationModel.find({ campaign: campaignId }).populate('donor', '-password').exec();
  }

  async findByDonor(donorId: string): Promise<Donation[]> {
    return this.donationModel.find({ donor: donorId }).populate('campaign').exec();
  }

  async updateStatus(id: string, status: DonationStatus): Promise<Donation | null> {
    return this.donationModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}

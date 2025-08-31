import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from '@fortrez/schemas';
import { DonationStatus } from '@fortrez/interfaces';
import { CampaignService } from '../campaigns/campaign.service';
import { CreateDonationDto } from './dto/donation.dto';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private campaignService: CampaignService,
  ) {}

  async findById(id: string): Promise<Donation | null> {
    return this.donationModel
      .findById(id)
      .populate('donor')
      .populate('campaign')
      .exec();
  }

  async create(createDonationDto: CreateDonationDto): Promise<Donation> {
    const createdDonation = new this.donationModel(createDonationDto);
    const donation = await createdDonation.save();

    // Update campaign raised amount
    await this.campaignService.updateRaisedAmount(
      donation.campaign.toString(),
      donation.amount,
    );

    return donation;
  }

  async findByCampaign(campaignId: string): Promise<Donation[]> {
    return this.donationModel
      .find({ campaign: campaignId })
      .populate('donor', '-password')
      .exec();
  }

  async findByDonor(donorId: string): Promise<Donation[]> {
    return this.donationModel
      .find({ donor: donorId })
      .populate('campaign')
      .exec();
  }

  async updateStatus(
    id: string,
    status: DonationStatus,
  ): Promise<Donation | null> {
    return this.donationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }
}

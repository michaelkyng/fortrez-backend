import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '@fortrez/schemas';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { Donation, DonationDocument } from '@fortrez/schemas';
import { DonationStatus } from '@fortrez/interfaces';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const newCampaign = new this.campaignModel(createCampaignDto);
    return newCampaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().populate('creator').exec();
  }

  async findById(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).populate('creator').exec();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignModel.findByIdAndUpdate(id, updateCampaignDto, { new: true }).exec();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async delete(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findByIdAndDelete(id).exec();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async updateRaisedAmount(campaignId: string, amount: number, txHash: string, donor: string, status: DonationStatus) {
    const campaign = await this.campaignModel.findById(campaignId).exec();
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.raisedAmount + amount > campaign.target) throw new BadRequestException('Campaign target exceeded');
    const donation = new this.donationModel({ txHash, amount, donor, campaign: campaignId, status });
    return this.campaignModel.updateOne(
      { _id: campaignId },
      { $inc: { raisedAmount: amount }, $push: { donations: donation._id } },
    );
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '@fortrez/schemas';
import { CreateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>
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

  async updateRaisedAmount(campaignId: string, amount: number) {
    return this.campaignModel.updateOne(
      { _id: campaignId },
      { $inc: { raisedAmount: amount } },
    );
  }
}

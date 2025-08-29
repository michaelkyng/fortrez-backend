import { Injectable } from '@nestjs/common';
import { HederaService } from './hedera.service';
import { CampaignService } from '../campaigns/campaign.service';
import { DonationService } from '../donations/donation.service';
import { CampaignStatus } from '../campaigns/campaign.schema';
import { DonationStatus } from '../donations/donation.schema';
import { DonorRef, CampaignRef } from '../common/interfaces/references';

@Injectable()
export class EscrowService {
  constructor(
    private hederaService: HederaService,
    private campaignService: CampaignService,
    private donationService: DonationService,
  ) {}

  async handleCampaignComplete(campaignId: string): Promise<void> {
    const campaign = await this.campaignService.findOne(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    const raisedPercentage =
      (campaign.raisedAmount / campaign.goalAmount) * 100;

    if (raisedPercentage >= 100) {
      // Transfer full amount to creator
      await this.hederaService.transferFromEscrow(
        campaign.creator.walletAddress,
        campaign.raisedAmount,
      );
      await this.campaignService.updateStatus(
        campaignId,
        CampaignStatus.FUNDED,
      );
    } else if (raisedPercentage >= 30) {
      // Transfer partial amount
      await this.hederaService.transferFromEscrow(
        campaign.creator.walletAddress,
        campaign.raisedAmount,
      );
      await this.campaignService.updateStatus(
        campaignId,
        CampaignStatus.FUNDED,
      );
    } else {
      // Allow refunds
      await this.campaignService.updateStatus(
        campaignId,
        CampaignStatus.FAILED,
      );
      // Implement refund logic here
    }
  }

  async processRefund(donationId: string): Promise<void> {
    const donation = await this.donationService.findById(donationId);
    if (!donation) {
      throw new Error('Donation not found');
    }

    const donorRef = donation.donor as DonorRef;
    const campaignRef = donation.campaign as CampaignRef;

    const campaign = await this.campaignService.findOne(
      campaignRef._id.toString(),
    );
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== CampaignStatus.FAILED) {
      throw new Error('Can only refund donations from failed campaigns');
    }

    // Process refund through Hedera
    await this.hederaService.transferFromEscrow(
      donorRef.walletAddress,
      donation.amount,
    );

    // Update donation status
    await this.donationService.updateStatus(
      donationId,
      DonationStatus.REFUNDED,
    );
  }
}

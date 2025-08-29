import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HederaService } from './hedera.service';
import { EscrowService } from './escrow.service';
import { CampaignModule } from '../campaigns/campaign.module';
import { DonationModule } from '../donations/donation.module';

@Module({
  imports: [ConfigModule, CampaignModule, DonationModule],
  providers: [HederaService, EscrowService],
  exports: [HederaService, EscrowService],
})
export class BlockchainModule {}

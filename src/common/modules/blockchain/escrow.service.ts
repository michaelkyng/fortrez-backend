import { Injectable } from "@nestjs/common";
import { BlockchainService } from "./blockchain.service";

@Injectable()
export class EscrowService {
  constructor(private readonly blockchain: BlockchainService) {}

  async holdFunds(donationId: string, donorWallet: string, amount: number) {
    // return this.blockchain.callContract('Escrow', 'deposit', [donationId, donorWallet, amount]);
  }

  async releaseFunds(campaignId: string) {
    // return this.blockchain.callContract('Escrow', 'release', [campaignId]);
  }

  async refund(donationId: string) {
    // return this.blockchain.callContract('Escrow', 'refund', [donationId]);
  }
}

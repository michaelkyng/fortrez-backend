import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { EscrowService } from './escrow.service';

@Module({
  providers: [BlockchainService, EscrowService],
  exports: [BlockchainService, EscrowService],
})
export class BlockchainModule {
  constructor(private readonly blockchainService: BlockchainService) {}
}

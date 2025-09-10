import { Injectable, Logger } from '@nestjs/common';
// import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
//   private provider: ethers.JsonRpcProvider;
//   private signer: ethers.Wallet;

  constructor() {
    // Load provider from ENV
    // this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

    // Load signer (server’s private key, or connect with wallet)
    // this.signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
  }

  /**
   * Load a contract instance
   */
//   getContract(abi: any, address: string) {
//     // return new ethers.Contract(address, abi, this.signer);
//   }

  /**
   * Call a read-only contract method
   */
//   async readContract(contract: ethers.Contract, method: string, params: any[] = []) {
//     // try {
//     //   return await contract[method](...params);
//     // } catch (error) {
//     //   this.logger.error(`Error reading contract: ${method}`, error.stack);
//     //   throw error;
//     // }
//   }

  /**
   * Call a write contract method (transaction)
   */
//   async writeContract(contract: ethers.Contract, method: string, params: any[] = []) {
//     // try {
//     //   const tx = await contract[method](...params);
//     //   this.logger.log(`Transaction sent: ${tx.hash}`);
//     //   return await tx.wait(); // wait for confirmation
//     // } catch (error) {
//     //   this.logger.error(`Error writing contract: ${method}`, error.stack);
//     //   throw error;
//     // }
//   }
}

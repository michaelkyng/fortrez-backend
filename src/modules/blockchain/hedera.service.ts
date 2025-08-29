import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
  TransactionReceipt,
  AccountCreateTransaction,
  AccountInfoQuery,
  TransactionId,
} from '@hashgraph/sdk';

@Injectable()
export class HederaService {
  private client: Client;
  private operatorId: string;
  private operatorKey: string;
  private escrowAccountId: string;
  private escrowPrivateKey: string;

  constructor(private configService: ConfigService) {
    const operatorId = this.configService.get<string>('HEDERA_OPERATOR_ID');
    const operatorKey = this.configService.get<string>(
      'HEDERA_OPERATOR_PRIVATE_KEY',
    );
    const escrowAccountId = this.configService.get<string>('ESCROW_ACCOUNT_ID');
    const escrowPrivateKey =
      this.configService.get<string>('ESCROW_PRIVATE_KEY');

    if (!operatorId || !operatorKey || !escrowAccountId || !escrowPrivateKey) {
      throw new Error('Missing required Hedera configuration');
    }

    this.operatorId = operatorId;
    this.operatorKey = operatorKey;
    this.escrowAccountId = escrowAccountId;
    this.escrowPrivateKey = escrowPrivateKey;

    // Initialize Hedera client
    if (this.configService.get<string>('HEDERA_NETWORK') === 'mainnet') {
      this.client = Client.forMainnet();
    } else {
      this.client = Client.forTestnet();
    }

    this.client.setOperator(
      AccountId.fromString(this.operatorId),
      PrivateKey.fromString(this.operatorKey),
    );
  }

  async createAccount(): Promise<{ accountId: string; privateKey: string }> {
    const privateKey = PrivateKey.generateED25519();
    const publicKey = privateKey.publicKey;

    const transaction = new AccountCreateTransaction()
      .setKey(publicKey)
      .setInitialBalance(new Hbar(0));

    const txResponse = await transaction.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);
    const newAccountId = receipt.accountId;
    if (!newAccountId) {
      throw new Error('Failed to create account: No account ID returned');
    }

    return {
      accountId: newAccountId.toString(),
      privateKey: privateKey.toStringRaw(),
    };
  }

  async transferHbar(
    fromAccountId: string,
    fromPrivateKey: string,
    amount: number,
  ): Promise<string> {
    const transaction = new TransferTransaction()
      .addHbarTransfer(AccountId.fromString(fromAccountId), new Hbar(-amount))
      .addHbarTransfer(
        AccountId.fromString(this.escrowAccountId),
        new Hbar(amount),
      )
      .freezeWith(this.client);

    const signedTx = await transaction.sign(
      PrivateKey.fromString(fromPrivateKey),
    );
    const txResponse = await signedTx.execute(this.client);
    await txResponse.getReceipt(this.client);

    return txResponse.transactionId.toString();
  }

  async transferFromEscrow(
    toAccountId: string,
    amount: number,
  ): Promise<string> {
    const transaction = new TransferTransaction()
      .addHbarTransfer(
        AccountId.fromString(this.escrowAccountId),
        new Hbar(-amount),
      )
      .addHbarTransfer(AccountId.fromString(toAccountId), new Hbar(amount))
      .freezeWith(this.client);

    const signedTx = await transaction.sign(
      PrivateKey.fromString(this.escrowPrivateKey),
    );
    const txResponse = await signedTx.execute(this.client);
    await txResponse.getReceipt(this.client);

    return txResponse.transactionId.toString();
  }

  async checkTransactionStatus(transactionId: string): Promise<boolean> {
    try {
      const receipt = await TransactionId.fromString(transactionId).getReceipt(
        this.client,
      );
      return receipt.status.toString() === 'SUCCESS';
    } catch {
      return false;
    }
  }

  async getAccountBalance(accountId: string): Promise<number> {
    const accountInfo = await new AccountInfoQuery()
      .setAccountId(AccountId.fromString(accountId))
      .execute(this.client);

    return accountInfo.balance.toTinybars().toNumber() / 100_000_000; // Convert from tinybars to HBAR
  }
}

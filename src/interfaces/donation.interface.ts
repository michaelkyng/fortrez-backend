export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface DonationResponseDto {
    id: string;
    amount: number;
    campaignId: string;
    donorId: string;
    txHash: string;
    status: DonationStatus;
    createdAt: Date;
}
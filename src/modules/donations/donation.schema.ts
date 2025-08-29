import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';
import { Campaign } from '../campaigns/campaign.schema';

export type DonationDocument = Donation & Document;

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Donation {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  donor: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaign: Campaign;

  @Prop({ required: true })
  txHash: string;

  @Prop({ type: String, enum: DonationStatus, default: DonationStatus.PENDING })
  status: DonationStatus;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';

export type DonationDocument = Donation & Document;

@Schema({ timestamps: true })
export class Donation extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaign: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  donor: Types.ObjectId;

  @Prop({ required: true })
  amount: number; // Amount in HBAR

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'failed';

  @Prop()
  transactionHash?: string; // Blockchain tx hash
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

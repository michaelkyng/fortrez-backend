import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User, Campaign, BaseSchema } from '@fortrez/schemas';
import { DonationStatus } from '@fortrez/interfaces';

export type DonationDocument = Donation & Document;



@Schema({ timestamps: true })
export class Donation extends BaseSchema   {

  @Prop({ required: true })
  txHash: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  donor: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Campaign', required: true })
  campaign: Campaign;

  @Prop({ type: String, enum: DonationStatus, default: DonationStatus.PENDING })
  status: DonationStatus;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

export type CampaignDocument = Campaign & Document;

export enum CampaignStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FUNDED = 'funded',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  goalAmount: number;

  @Prop({ default: 0 })
  raisedAmount: number;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.PENDING })
  status: CampaignStatus;

  @Prop()
  escrowAccountId: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

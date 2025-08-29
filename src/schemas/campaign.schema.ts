import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId; // Campaign owner

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  goalAmount: number; // In HBAR tokens

  @Prop({ default: 0 })
  raisedAmount: number;

  @Prop({ enum: ['pending', 'active', 'successful', 'failed'], default: 'pending' })
  status: 'pending' | 'active' | 'successful' | 'failed';

  @Prop()
  deadline: Date;

  @Prop({ type: [String], default: [] })
  media?: string[]; // Images, video links, etc.
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

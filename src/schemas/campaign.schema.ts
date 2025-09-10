import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { CampaignStatus, CampaignType, CampaignCategory } from '../interfaces';

export type CampaignDocument = Campaign & Document;

// Define a sub-schema for deadline
@Schema({ _id: false }) // no _id for embedded object
export class Deadline {
  @Prop({ type: Date, default: null })
  date: Date | null;

  @Prop({ type: Boolean, default: false })
  hasDeadline: boolean;
}

export const DeadlineSchema = SchemaFactory.createForClass(Deadline);

@Schema({ timestamps: true })
export class Campaign extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  problem: string;

  @Prop({ type: [String], default: [] })
  solutions: string[];

  @Prop({ required: true })
  target: number;

  @Prop({ default: 0 })
  raisedAmount: number; 

  @Prop({ type: [Types.ObjectId], ref: 'Donation', default: [] })
  donations: Types.ObjectId[];

  @Prop({ type: DeadlineSchema, default: () => ({ date: null, hasDeadline: false }) })
  deadline: Deadline;

  @Prop({ default: false })
  status: CampaignStatus;

  @Prop({ required: true })
  category: CampaignCategory;

  @Prop({ required: true })
  type: CampaignType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

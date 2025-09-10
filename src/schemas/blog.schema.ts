import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from './base.schema';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  content?: string; // optional full article body

  @Prop({ required: true })
  coverImage: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

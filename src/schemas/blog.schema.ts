// src/blogs/schemas/blog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  content?: string; // optional full article body

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: false })
  isPublished: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

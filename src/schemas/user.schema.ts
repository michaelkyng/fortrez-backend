import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string; // Optional, in case user registers via email instead of wallet

  @Prop({ unique: true, sparse: true })
  walletAddress?: string; // HBAR wallet address

  @Prop()
  name?: string;

  @Prop({ default: 'user' })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);

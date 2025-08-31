import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';
import { UserRole } from 'src/interfaces/user.interface';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true, sparse: true })
  walletAddress?: string; // HBAR wallet address


  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Prop({ default: false })
  requires2FA: boolean;
  
  @Prop({ type: [Types.ObjectId], ref: 'Campaign', default: [] })
  campaigns: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Donation', default: [] })
  donations: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Blog', default: [] })
  blogs: Types.ObjectId[]; 

}

export const UserSchema = SchemaFactory.createForClass(User);

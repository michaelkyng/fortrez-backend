import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BaseSchema {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
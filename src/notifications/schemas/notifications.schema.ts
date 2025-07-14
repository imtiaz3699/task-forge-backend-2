import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Notification {
  @Prop({ type:Types.ObjectId,ref:"User",requried: true })
  user_id: {
    type: Types.ObjectId;
    required: true;
  };
  @Prop()
  title: string;
  @Prop()
  message: string;
  @Prop({ default: false })
  read: boolean;
}


export type NotificationDocument = Notification & Document
export const NotificationSchema = SchemaFactory.createForClass(Notification) 
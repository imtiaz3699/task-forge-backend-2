import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  full_name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  phone_number: string;
  @Prop()
  company_name: string;
  @Prop()
  address: string;
  @Prop()
  city: string;
  @Prop()
  country: string;
  @Prop()
  postal_code: string;
  @Prop()
  website: string;
  @Prop()
  notes: string;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);

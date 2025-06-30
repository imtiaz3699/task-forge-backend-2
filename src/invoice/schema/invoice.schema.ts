import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
export class Invoice {
  @Prop()
  client_id: string;

  @Prop()
  invoice_number: string;

  @Prop()
  date_of_issue: Date;

  @Prop()
  due_date: Date;

  @Prop()
  status: string;

  @Prop()
  payment_method: string;

  @Prop()
  notes: string;

  @Prop()
  terms: string;

  @Prop()
  currency: string;
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product_id: Types.ObjectId;

  @Prop({ type: Boolean })
  tax_included: boolean;
}
export type InvoiceDocument = Invoice & Document;

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

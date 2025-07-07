import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
class InvoiceProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  unit_price: number;

  @Prop()
  total_price: number; // optional, can also calculate dynamically
}

const InvoiceProductSchema = SchemaFactory.createForClass(InvoiceProduct);
export class Invoice {
  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client_id: Types.ObjectId;

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
    type: [{ type: Types.ObjectId, ref: 'Product' }],
    required: true,
  })
  product_id: Types.ObjectId[];
  @Prop({ type: [InvoiceProductSchema], required: true })
  products: InvoiceProduct[];

  @Prop({ type: Boolean })
  tax_included: boolean;
}
export type InvoiceDocument = Invoice & Document;

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

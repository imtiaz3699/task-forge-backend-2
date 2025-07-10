import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';
@Schema()
export class Counter extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  seq: number;
}
export const CounterSchema = SchemaFactory.createForClass(Counter);

@Schema({ timestamps: true })
export class InvoiceProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  unit_price: number;

  @Prop()
  total_price: number;
}

const InvoiceProductSchema = SchemaFactory.createForClass(InvoiceProduct);
@Schema({ timestamps: true })
export class Invoice {
  @Prop({ unique: true })
  invoice_number: string;
  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client_id: Types.ObjectId;

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

import { Document } from 'mongoose';
import { Product } from 'src/product/interfaces/product.interfaces';
export interface Invoice extends Document {
  client_id: string;
  date_of_issue: Date;
  due_date: Date;
  status: string;
  payment_method: string;
  notes: string;
  terms: string;
  currency: string;
  product_id: [string];
  tax_included: boolean;
  products: [
    {
      product_id: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    },
  ];
}

import { Document } from 'mongoose';
import { Product } from 'src/product/interfaces/product.interfaces';
export interface Invoice extends Document {
  client_id: string;
  invoice_number: string;
  date_of_issue: Date;
  due_date: Date;
  status: string;
  payment_method: string;
  notes: string;
  terms: string;
  currency: string;
  product_id: [string];
  tax_included: boolean;
  products: Product[];
}

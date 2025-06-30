import { Document } from 'mongoose';
export interface Client extends Document {
  full_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  website: string;
  notes: string;
}

import { Document } from 'mongoose';

export interface Category extends Document {
  title: string;
  description: string;
}

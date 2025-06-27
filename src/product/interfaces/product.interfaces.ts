import { Document } from 'mongoose';

export interface Product extends Document {
  title: string;
  description: string;
  short_description: string;
  price: number;
  currency: string;
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  images: [string];
  thumbnail: [string];
  category: string;
  tags: [string];
  isActive: boolean;
  isFeatured: boolean;
}

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
  images: [
    {
      public_id: { type: String };
      url: { type: String };
    },
  ];
  thumbnail: [
    [
      {
        public_id: { type: String };
        url: { type: String };
      },
    ],
  ];
  category: string;
  tags: [string];
  isActive: boolean;
  isFeatured: boolean;
  quantity: number;
  invoice_id?: string;
}

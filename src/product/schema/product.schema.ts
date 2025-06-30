import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Just a plain class
@Schema({ timestamps: true })
export class Product {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  short_description: string;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  stock: number;

  @Prop({
    type: {
      height: Number,
      width: Number,
      depth: Number,
    },
  })
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };

  @Prop({
    type: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    default: [],
  })
  images: [
    {
      public_id: string;
      url: string;
    },
  ];

  @Prop({
    type: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    default: [],
  })
  thumbnail: [
    {
      public_id: string;
      url: string;
    },
  ];

  @Prop({ type: Types.ObjectId,ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop([String])
  tags: string[];

  @Prop()
  isActive: boolean;

  @Prop()
  isFeatured: boolean;
  @Prop({type:Number,default:0})
  quantity: number;
  @Prop({type:Types.ObjectId,ref:"Invoice"})
  invoice_id:string
}

// 👇 Define this for Mongoose typing
export type ProductDocument = Product & Document;

// 👇 Generate schema
export const ProductSchema = SchemaFactory.createForClass(Product);

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

  @Prop([String])
  images: string[];

  @Prop([String])
  thumbnail: string[];

  @Prop({ type: Types.ObjectId, required: true })
  category: Types.ObjectId;

  @Prop([String])
  tags: string[];

  @Prop()
  isActive: boolean;

  @Prop()
  isFeatured: boolean;
}

// 👇 Define this for Mongoose typing
export type ProductDocument = Product & Document;

// 👇 Generate schema
export const ProductSchema = SchemaFactory.createForClass(Product);

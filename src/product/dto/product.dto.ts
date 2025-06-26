import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsString()
  _id: string;
  @IsNotEmpty()
  title: string;
  @IsString()
  description: string;
  @IsString()
  short_description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsString()
  currency: string;
  @IsObject()
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  images: [string];
  @IsArray()
  thumbnail: [string];
  @IsString()
  category: string;
  @IsArray()
  tags: [string];
  @IsBoolean()
  isActive: boolean;
  @IsBoolean()
  isFeatured: boolean;
}

export class UpdateProductDto extends PartialType(ProductDto) {}

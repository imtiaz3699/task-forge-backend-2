import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
export class ImageDto {
  @IsNotEmpty()
  @IsString()
  public_id: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
export class ProductDto {
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
  @IsArray()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  thumbnail: ImageDto[];
  @IsString()
  category: string;
  @IsArray()
  tags: [string];
  @IsBoolean()
  isActive: boolean;
  @IsBoolean()
  isFeatured: boolean;
  @IsNumber()
  quantity: number;
  @IsString()
  invoice_id: string;
}

export class UpdateProductDto extends PartialType(ProductDto) {}

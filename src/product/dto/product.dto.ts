import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
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
  @ArrayMaxSize(5)
  @Type(() => ImageDto)
  images: ImageDto[];
  @ArrayMaxSize(3)
  @IsArray()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  thumbnail: ImageDto[];
  @IsString()
  category: string;
  @ArrayMaxSize(10)
  @IsArray()
  tags: [string];
  @IsBoolean()
  isActive: boolean;
  @IsBoolean()
  isFeatured: boolean;
  @IsNumber()
  quantity: number;
  @IsOptional()
  @IsString()
  invoice_id?: string;
}

export class UpdateProductDto extends PartialType(ProductDto) {}

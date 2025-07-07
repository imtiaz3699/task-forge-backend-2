import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Invoice } from '../schema/invoice.schema';
import { ProductDto } from 'src/product/dto/product.dto';

export class InvoiceDto {
  @IsNotEmpty()
  @IsString()
  client_id: string;
  @IsString()
  invoice_number: string;
  @Type(() => Date)
  @IsDate()
  date_of_issue: Date;
  @Type(() => Date)
  @IsDate()
  due_date: Date;
  @IsString()
  status: string;
  @IsString()
  payment_method: string;
  @IsString()
  notes: string;
  @IsString()
  terms: string;
  @IsString()
  currency: string;
  @ArrayMaxSize(10)
  @IsArray()
  @IsString({ each: true })
  product_id: string[];
  @IsBoolean()
  tax_included: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}

export class UpdateInvoiceDto extends PartialType(InvoiceDto) {}

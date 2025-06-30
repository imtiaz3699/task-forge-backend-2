import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class InvoiceDto {
  @IsNotEmpty()
  client_id: string;
  @IsString()
  invoice_number: string;
  @IsDate()
  date_of_issue: Date;
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
  @IsArray()
  product_id: [string];
  @IsString()
  tax_included: string;
}

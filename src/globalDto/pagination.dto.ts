import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  limit?: number;
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  offset?: number;
}
export class ClientQueryDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPositive()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  offset?: number;
}

export class ProductQueryDto {
  @IsString()
  @IsOptional()
  product_name?: string;
  
  @Type(() => Number)
  @IsOptional()
  minPrice: number;
  
  @Type(() => Number)
  @IsOptional()
  maxPrice: number;
  @Type(()=> Number)
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  offset?: number;
}

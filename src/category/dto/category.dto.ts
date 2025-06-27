import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
export class CategoryDto {
  @IsString()
  _id: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}

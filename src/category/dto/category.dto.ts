import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
export class CategoryDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interface/category.interfaces';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) {}
  async create(data: CategoryDto): Promise<Category> {
    if (!data) {
      throw new UnauthorizedException('Data is is missing.');
    }
    if (!data?.title) {
      throw new UnauthorizedException('Title is required.');
    }
    if (!data?.description) {
      throw new UnauthorizedException('Description is required.');
    }
    const category = new this.categoryModel(data);
    await category.save();
    return category;
  }
  async update(id: string, data: UpdateCategoryDto): Promise<Category | null> {
    return await this.categoryModel.findByIdAndUpdate(id, data);
  }
  async getAll(): Promise<Category[]> {
    return await this.categoryModel
      .find()
      .skip((1 - 1) * 30)
      .limit(30);
  }
  async delete(id: string): Promise<Category | null> {
    const res = await this.categoryModel.findByIdAndDelete(id);
    if (!res) {
      throw new UnauthorizedException('Category Not Found.');
    } else {
      return res;
    }
  }
  async getOne(id: string): Promise<Category | null> {
    return await this.categoryModel.findById(id);
  }
}

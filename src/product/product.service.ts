import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interfaces';
import { Model } from 'mongoose';
import { ProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}
async create(data: ProductDto): Promise<Product> {
    if (!data) {
      throw new UnauthorizedException('Product data is required.');
    }
    if (!data?.title) {
      throw new UnauthorizedException('Title is required.');
    }
    if (!data?.price) {
      throw new UnauthorizedException('Price is required.');
    }
    if (!data?.category) {
      throw new UnauthorizedException('Category is required.');
    }
    const product = new this.productModel(data);
    await product.save();
    return product;
  }
  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    return await this.productModel.findByIdAndUpdate(id, data);
  }
  async getAll(): Promise<Product[]> {
    return await this.productModel.find();
  }
  async delete(id: string): Promise<Product | null> {
    return await this.productModel.findByIdAndDelete(id);
  }
  async getOne(id: string): Promise<Product | null> {
    return await this.productModel.findById(id);
  }
}

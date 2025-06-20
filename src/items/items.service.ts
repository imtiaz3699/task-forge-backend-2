import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}
  async findAll(): Promise<Item[]> {
    return await this.itemModel.find();
  }
  async findOne(id: string): Promise<Item | null> {
    return await this.itemModel.findById(id);
  }
  async createItem(data: Item): Promise<Item | null> {
    return await this.itemModel.create(data);
  }
  async deleteItem(id: string): Promise<Item | null> {
    return await this.itemModel.findByIdAndDelete(id);
  }
  async updateItem(id: string, data: Item): Promise<Item | null> {
    const item = await this.itemModel.findByIdAndUpdate(id, data);
    return item;
  }
}

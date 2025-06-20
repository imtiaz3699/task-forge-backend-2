import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';
@Injectable()
export class ItemsService {
  private readonly items: Item[] = [
    {
      id: '97594879',
      name: 'Item 1',
      description: 'Description',
      qty: 10,
    },
    {
      id: '97594879',
      name: 'Item 2',
      description: 'Description 2',
      qty: 50,
    },
  ];

  findAll(): Item[] {
    return this.items;
  }
}

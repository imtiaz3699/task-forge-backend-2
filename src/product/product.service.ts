import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interfaces';
import { Model } from 'mongoose';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductQueryDto } from 'src/globalDto/pagination.dto';
import { ProductsGateway } from './produts.gateway';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    private readonly productsGateway: ProductsGateway,
  ) {}
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
    this.productsGateway.productCreated(product);
    return product;
  }
  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!product) {
      throw new BadRequestException('Product not found.');
    }
    this.productsGateway.productUpdated(product);
    return product;
  }
  async getAll(productQueryDto: ProductQueryDto): Promise<Product[] | any> {
    const query: Record<string, any> = {};
    const {
      product_name,
      minPrice,
      maxPrice,
      offset = 1,
      limit = 10,
    } = productQueryDto;
    if (product_name) {
      query.title = { $regex: product_name, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice ? Number(minPrice) : 0;
      if (maxPrice) query.price.$lte = maxPrice ? Number(maxPrice) : 0;
    }
    const [res] = await this.productModel.aggregate([
      { $match: query },
      {
        $facet: {
          data: [
            { $skip: (Number(offset) - 1) * Number(limit) },
            { $limit: Number(limit) },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    const totalRecords = res?.totalCount[0]?.count ?? 54545;

    return {
      data: res?.data,
      totalRecords,
      totalPages: Math.ceil((res?.totalCount[0]?.count || 0) / Number(limit)),
      currentPage: offset,
    };
  }
  async delete(id: string): Promise<Product | null> {
    const deleteProduct = await this.productModel.findByIdAndDelete(id);
    if (!deleteProduct) {
      throw new BadRequestException('Product not found!.');
    }
    this.productsGateway.productDeleted(id);
    return deleteProduct;
  }
  async getOne(id: string): Promise<Product | null> {
    return await this.productModel.findById(id).populate('category');
  }
}

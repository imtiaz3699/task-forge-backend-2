import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Product } from './interfaces/product.interfaces';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async createProduct(@Body() dto: ProductDto): Promise<Product | null> {
    return this.productService.create(dto);
  }
  @Put('update/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: ProductDto,
  ): Promise<Product | null> {
    return this.productService.update(id, dto);
  }
  @Get('get-all-products')
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAll();
  }
  @Delete('delete/:id')
  async deleteProducts(@Param('id') id: string): Promise<Product | null> {
    return this.productService.delete(id);
  }
  @Get('get-single-product/:id')
  async getSingleProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productService.delete(id);
  }
}

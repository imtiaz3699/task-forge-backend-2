import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Category } from './interface/category.interfaces';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post('create')
  async createCategory(@Body() dto: CategoryDto): Promise<Category | null> {
    return this.categoryService.create(dto);
  }
  @Put('update/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CategoryDto,
  ): Promise<Category | null> {
    return this.categoryService.update(id, dto);
  }
  @Get('get-all-categories')
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAll();
  }
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.delete(id);
  }
  @Get('get-single-category/:id')
  async getSingleCategory(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.getOne(id);
  }
}

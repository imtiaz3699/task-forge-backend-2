import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Product } from './interfaces/product.interfaces';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { configureCloudinary } from 'src/config/cloudinary';
import toStream = require('buffer-to-stream');
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { ProductQueryDto } from 'src/globalDto/pagination.dto';
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API'),
      api_secret: this.configService.get('CLOUDINARY_SECRET'),
    });
  }

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
  async getAllProducts(@Query('') productQueryDto:ProductQueryDto ): Promise<Product[]> {
    return this.productService.getAll(productQueryDto);
  }
  @Delete('delete-product/:id')
  async deleteProducts(@Param('id') id: string): Promise<Product | null> {
    return this.productService.delete(id);
  }
  @Get('get-single-product/:id')
  async getSingleProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getOne(id);
  }

  @Post('upload-images')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'product_images', maxCount: 10 },
      { name: 'thumbnail_images', maxCount: 5 },
    ]),
  )
  async uploadImages(
    @UploadedFiles()
    files: {
      product_images?: Express.Multer.File[];
      thumbnail_images?: Express.Multer.File[];
    },
  ) {
    const uploadToCloudinary = (file: Express.Multer.File) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: file.originalname.split('.')[0],
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('Upload failed.', error);
              return reject(error);
            }
            return resolve({
              url: result?.secure_url,
              public_id: result?.public_id,
            });
          },
        );
        toStream(file.buffer).pipe(uploadStream);
      });
    };
    const productImages = files.product_images
      ? await Promise.all(files.product_images.map(uploadToCloudinary))
      : [];

    const thumbnailImages = files.thumbnail_images
      ? await Promise.all(files.thumbnail_images.map(uploadToCloudinary))
      : [];
    return {
      product_images: productImages,
      thumbnail_images: thumbnailImages,
    };
  }
}

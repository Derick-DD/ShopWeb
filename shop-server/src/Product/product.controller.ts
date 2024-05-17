import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { PaginationQueryDto } from '../Common/Dto/pagination-query.dto';
import { CreateProductDto } from './Dto/create-product.dto';
import { UpdateProductDto } from './Dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../Common/Decorators/roles.decorator';
import { Role } from '../Common/Enums/Roles';

import { ISerializeResponse } from '../Common/Service/serializer.service';
import { ProductEntity } from '../Entity/product.entity';
import { ResponseMessage } from '../Common/Types/request';
import { ProductImage } from './product';
import { Public } from '../Common/Decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  async findAllProducts(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<ISerializeResponse<ProductEntity[]>> {
    return this.productService.getAllProducts(paginationQuery);
  }

  @Public()
  @Get('/ofCategory/:categoryId')
  async findByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<ISerializeResponse<ProductEntity[]>> {
    return this.productService.getProductsByCategoryId(categoryId);
  }

  @Public()
  @Get(':id')
  findOneProduct(
    @Param('id') id: string,
  ): Promise<ISerializeResponse<ProductEntity>> {
    return this.productService.getProduct(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ISerializeResponse<ProductEntity>> {
    return this.productService.createProduct(createProductDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ISerializeResponse<ProductEntity>> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Admin)
  removeProduct(
    @Param('id') id: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.productService.removeProduct(id);
  }

  @ApiBearerAuth()
  @Post(':id/upload')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  uploadProductPic(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<ISerializeResponse<ProductImage>> {
    return this.productService.uploadProductImage(id, file);
  }
}

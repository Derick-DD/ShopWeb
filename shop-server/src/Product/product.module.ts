import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../Entity/product.entity';
import { CategoryEntity } from '../Entity/category.entity';
import { AwsService } from '../Common/Service/aws.service';
import { CartEntity } from 'src/Entity/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, CartEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService, AwsService],
})
export class ProductModule {}

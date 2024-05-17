import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../Entity/cart.entity';
import { ProductEntity } from '../Entity/product.entity';
import { UserEntity } from '../Entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, ProductEntity, UserEntity])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

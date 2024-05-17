import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../Entity/user.entity';
import { CartEntity } from '../Entity/cart.entity';
import { OrderEntity } from '../Entity/order.entity';
import { OrderItemEntity } from '../Entity/orderItem.entity';
import { AddressEntity } from 'src/Entity/address.entity';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from 'src/Common/Service/redis.service';
import { ProductEntity } from 'src/Entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CartEntity,
      OrderEntity,
      OrderItemEntity,
      AddressEntity,
      ProductEntity,
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, RedisService],
})
export class OrderModule {}

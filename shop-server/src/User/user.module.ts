// Nest dependencies
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { UserEntity } from '../Entity/user.entity';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { MailService } from '../Common/Service/mail.service';
import { AwsService } from '../Common/Service/aws.service';
import { CartEntity } from '../Entity/cart.entity';
import { OrderEntity } from '../Entity/order.entity';
import { OrderItemEntity } from '../Entity/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CartEntity,
      OrderEntity,
      OrderItemEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService, MailService, AwsService],
  exports: [UserService],
})
export class UserModule {}

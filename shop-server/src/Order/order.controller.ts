import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Roles } from 'src/Common/Decorators/roles.decorator';
import { Role } from 'src/Common/Enums/Roles';
import { ISerializeResponse } from 'src/Common/Service/serializer.service';
import { AddressEntity } from 'src/Entity/address.entity';
import { jwtManipulationService } from 'src/Common/Service/jwt.manipulation.service';
import { ResponseMessage } from 'src/Common/Types/request';
import { AddAddressDto } from './Dto/add-address.dto';
import { CreateOrderDto } from './Dto/create-order.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // fundamental order operations
  @ApiBearerAuth()
  @Get()
  @Roles(Role.User)
  getOrders(@Headers('authorization') bearer: string) {
    return this.orderService.getOrders(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @Get('/all')
  @Roles(Role.Admin)
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  //paypal
  @ApiBearerAuth()
  @Post('/create-paypal-order')
  @Roles(Role.User)
  createPayPalOrder(
    @Headers('authorization') bearer: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(
      createOrderDto,
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @Get('/complete-paypal-order/:id')
  @Roles(Role.User)
  completePayment(@Param('id') orderId: string) {
    return this.orderService.completePayment(orderId);
  }

  @ApiBearerAuth()
  @Get('/cancel-paypal-order/:id')
  @Roles(Role.User)
  cancelOrder(
    @Param('id') orderId: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.orderService.cancelPaypalOrder(orderId);
  }

  //address operations
  @ApiBearerAuth()
  @Get('/address')
  @Roles(Role.User)
  getAddress(
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<AddressEntity[]>> {
    return this.orderService.getUserAddress(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @Post('/address')
  @Roles(Role.User)
  createAddress(
    @Body() addAddressDto: AddAddressDto,
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.orderService.addUserAddress(
      addAddressDto,
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @Delete('/address/:id')
  @Roles(Role.User)
  deleteAddress(
    @Headers('authorization') bearer: string,
    @Param('id') addressId: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.orderService.deleteUserAddress(
      addressId,
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }
}

import { Body, Controller, Delete, Get, Headers, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { jwtManipulationService } from '../Common/Service/jwt.manipulation.service';
import { CartService } from './cart.service';
import { ISerializeResponse } from '../Common/Service/serializer.service';
import { Roles } from '../Common/Decorators/roles.decorator';
import { Role } from '../Common/Enums/Roles';
import { CartDto } from './Dto/cart.dto';
import { CartEntity } from '../Entity/cart.entity';
import { ResponseMessage } from '../Common/Types/request';

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.User)
  getCart(
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<CartEntity[]>> {
    return this.cartService.getCart(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @Delete('')
  @Roles(Role.User)
  clearCart(
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.cartService.clearCart(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
    );
  }

  @ApiBearerAuth()
  @Patch('/update')
  @Roles(Role.User)
  updateCart(
    @Body() cartList: CartDto[],
    @Headers('authorization') bearer: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.cartService.updateCart(
      jwtManipulationService.decodeJwtToken(bearer, 'username'),
      cartList,
    );
  }
}

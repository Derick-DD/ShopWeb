import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../Entity/cart.entity';
import { UserEntity } from '../Entity/user.entity';
import { In, Repository } from 'typeorm';
import { CartDto } from './Dto/cart.dto';
import { ProductEntity } from '../Entity/product.entity';
import {
  ISerializeResponse,
  serializerService,
} from '../Common/Service/serializer.service';
import { ResponseMessage } from '../Common/Types/request';
import { CartValues } from './cart';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getCart(username: string): Promise<ISerializeResponse<CartEntity[]>> {
    let user: UserEntity;
    try {
      user = await this.userRepository.findOne({
        where: { username },
        relations: ['cart', 'cart.product'],
      });
      if (!user) {
        throw new NotFoundException('No such user');
      }
    } catch (err) {
      throw new NotFoundException('No such user');
    }
    return serializerService.serializeResponse<CartEntity[]>('cart', user.cart);
  }

  async updateCart(
    username: string,
    cartList: CartDto[],
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let user: UserEntity;
    try {
      user = await this.userRepository.findOne({
        where: { username },
        relations: ['cart'],
      });
      if (!user) {
        throw new NotFoundException('No such user');
      }
    } catch (err) {
      throw new NotFoundException('No such user');
    }
    const productIdList: string[] = [];
    cartList.map(async (cartItem: CartDto) => {
      productIdList.push(cartItem.productId);
    });
    const productEntities: ProductEntity[] =
      await this.productRepository.findBy({
        id: In(productIdList),
      });
    if (productEntities.length !== productIdList.length) {
      throw new BadRequestException('Invalid product exists');
    }
    // completely refresh users cart, if update failed, call back the origin carts.
    // this.clearCart(username);

    const cartValues: CartValues[] = [];
    cartList.map(async (cartItem: CartDto, index: number) => {
      cartValues.push({
        user: user,
        product: productEntities[index],
        count: cartItem.count,
      });
    });
    try {
      await this.clearCart(username);
      try {
        await this.cartRepository.save(cartValues);
      } catch (e) {
        await this.cartRepository.save(user.cart);
        throw new NotImplementedException('Cart is not valid');
      }
    } catch (err) {
      throw new NotImplementedException('Cart updation failed');
    }

    // await this.cartRepository.save(cartValues).catch(async (err) => {
    //   await this.userRepository.save(user);
    //   if (err instanceof QueryFailedError) {
    //     throw new NotImplementedException('Cart can not be saved');
    //   } else {
    //     throw new BadRequestException('Cart is not saved of some reason');
    //   }
    // });
    // const newCart: CartEntity[] = this.cartRepository.create(cartValues);
    // user.cart = newCart;
    // await this.userRepository.save(user);

    // console.log(cartValues);
    // await this.cartRepository.save(cartValues).catch(async (err) => {
    //   await this.userRepository.save(user);
    //   if (err instanceof QueryFailedError) {
    //     throw new NotImplementedException('Cart can not be saved');
    //   } else {
    //     throw new BadRequestException('Cart is not saved of some reason');
    //   }
    // });
    // try {
    //   console.log(cartValues[0].user);
    //   await this.cartRepository.save(cartValues);
    // } catch (e) {
    //   console.log(user);
    //   await this.userRepository.save(user);
    // }
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Cart has been saved',
    });
  }

  async clearCart(
    username: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let user: UserEntity;
    try {
      user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) {
        throw new NotFoundException('No such user');
      }
    } catch (err) {
      throw new NotFoundException('No such user');
    }
    const cartOfUser: CartEntity[] = await this.cartRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
      },
    });
    this.cartRepository.remove(cartOfUser);

    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Cart has been cleared',
    });
  }
}

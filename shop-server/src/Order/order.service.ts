import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../Entity/cart.entity';
import { OrderEntity } from '../Entity/order.entity';
import { OrderItemEntity } from '../Entity/orderItem.entity';
import { UserEntity } from '../Entity/user.entity';
import { In, Repository } from 'typeorm';
import { AddAddressDto } from './Dto/add-address.dto';
import { AddressEntity } from 'src/Entity/address.entity';
import { serializerService } from 'src/Common/Service/serializer.service';
import { ResponseMessage } from 'src/Common/Types/request';
import { CartItemsDto, CreateOrderDto } from './Dto/create-order.dto';
import { ProductEntity } from 'src/Entity/product.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { RedisService } from 'src/Common/Service/redis.service';
import { deleteOrderDto } from './Dto/delete-order.dto';
import { OrderItemRes } from './order';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,

    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async getAllOrders() {
    const orders: OrderEntity[] = await this.orderRepository.find({
      relations: ['user', 'items'],
    });
    const orderRes: OrderItemRes[] = [];
    for (const orderItem of orders) {
      orderRes.push({
        ...orderItem,
        user: orderItem.user.username,
      });
    }
    return serializerService.serializeResponse<OrderItemRes[]>(
      'userOrderList',
      orderRes,
    );
  }

  async getOrders(username: string) {
    const orders: OrderEntity[] = await this.orderRepository.find({
      where: {
        user: { username },
        hide: false,
      },
      relations: ['items'],
    });
    console.log(orders);
    return serializerService.serializeResponse<OrderEntity[]>(
      'userOrderList',
      orders,
    );
  }

  async getOneOrder(id: string, username: string) {
    const order: OrderEntity = await this.orderRepository.findOne({
      where: {
        user: { username },
        id,
        hide: false,
      },
      relations: ['items'],
    });
    return serializerService.serializeResponse<OrderEntity>(
      'userOrderList',
      order,
    );
  }

  async deleteOrders(username: string, dto: deleteOrderDto) {
    const orders: OrderEntity[] = await this.orderRepository.find({
      where: {
        user: { username },
        id: In(dto.orderIds),
      },
      relations: ['user'],
    });
    if (orders.length !== dto.orderIds.length) {
      throw new BadRequestException('Incorrect Order Information');
    }
    orders.forEach((orderItem) => {
      orderItem.hide = true;
    });
    await this.orderRepository.save(orders);
    serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Order Record has been deleted',
    });
  }

  //order services paypal
  async createOrder(dto: CreateOrderDto, username: string) {
    // const test = await this.orderItemRepository.find();
    // this.orderItemRepository.remove(test);
    // const test2 = await this.orderRepository.find();
    // this.orderRepository.remove(test2);
    // return;
    let addressInfo: AddressEntity;
    try {
      addressInfo = await this.addressRepository.findOne({
        where: {
          id: dto.addressId,
          user: {
            username,
          },
        },
        relations: ['user'],
      });
      if (!addressInfo) {
        throw new NotFoundException('Address not found');
      }
    } catch {
      throw new NotFoundException('Address not found');
    }
    const productIdList: string[] = [];
    dto.cartItems.map(async (item: CartItemsDto) => {
      productIdList.push(item.productId);
    });
    const productItems: ProductEntity[] = await this.productRepository.findBy({
      id: In(productIdList),
    });

    if (productItems.length !== productIdList.length) {
      throw new BadRequestException('Some products does not exist');
    }

    const orderItems: Partial<OrderItemEntity>[] = [];
    const paypalItems: any[] = [];
    let totalPrice = 0;
    const shippingPrice = 8; //temp value for test delivery fee;
    for (let i = 0; i < productItems.length; i++) {
      totalPrice += dto.cartItems[i].count * productItems[i].price;
      orderItems.push({
        productId: productItems[i].id,
        name: productItems[i].name,
        imagePath: productItems[i].imagePath,
        price: productItems[i].price,
        count: dto.cartItems[i].count,
      });
      paypalItems.push({
        name: productItems[i].name,
        quantity: dto.cartItems[i].count,
        unit_amount: {
          currency_code: 'HKD',
          value: productItems[i].price,
        },
      });
    }

    //create order records
    const { name, phone, addressName, address, district, addressDetail, user } =
      addressInfo;
    const addressJson = JSON.stringify({
      addressName,
      address,
      district,
      addressDetail,
    });

    try {
      const oldOrder = await this.orderRepository.findOne({
        where: {
          pend: false,
          name,
          phone,
          addressInfo: addressJson,
          total: totalPrice,
          user,
        },
        relations: ['user'],
      });
      if (oldOrder) {
        throw new ConflictException('Do not resubmit the same order');
      }
    } catch {
      throw new UnprocessableEntityException('Order can not be processed');
    }

    const orderEntity = await this.orderRepository.save({
      name,
      phone,
      addressInfo: addressJson,
      total: totalPrice,
      user,
      items: orderItems,
      payee: process.env.PAYPAL_BUSINESS_ACCOUNT,
    });

    //delete the corresponding cart items
    const cartEntities = await this.cartRepository.find({
      where: {
        user: {
          id: user.id,
        },
        product: {
          id: In(productIdList),
        },
      },
      relations: ['user', 'product'],
    });

    await this.cartRepository.remove(cartEntities);

    const payment_request_id = uuid();
    const access_token = await this.getPaypalAccessToken();

    const paypalData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderEntity.id,
          description: 'SHOPXX order',
          items: paypalItems,
          amount: {
            currency_code: 'HKD',
            value: totalPrice + shippingPrice,
            breakdown: {
              item_total: {
                currency_code: 'HKD',
                value: totalPrice,
              },
              shipping: {
                currency_code: 'HKD',
                value: shippingPrice,
              },
            },
          },
          payee: {
            email_address: process.env.PAYPAL_BUSINESS_ACCOUNT,
          },
          shipping: {
            name: {
              fullname: name,
            },
            address: {
              address_line_1: addressName + ', ' + address,
              address_line_2: addressDetail,
              admin_area_2: district,
              country_code: 'HK',
            },
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'IEMS-SHOP10',
            locale: 'zh-HK',
            landing_page: 'LOGIN',
            shipping_preference: 'SET_PROVIDED_ADDRESS',
            user_action: 'PAY_NOW',
            return_url: `${process.env.APP_DOMAIN}/order/complete`,
            cancel_url: `${process.env.APP_DOMAIN}/order/cart`,
          },
        },
      },
    };

    const paypalOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        'PayPal-Request-Id': payment_request_id,
      },
    };

    const paypalResData = await lastValueFrom(
      this.httpService
        .post(
          'https://api-m.sandbox.paypal.com/v2/checkout/orders',
          paypalData,
          paypalOptions,
        )
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new NotImplementedException('Payment can not be implemented');
          }),
        ),
    );

    this.redisService.setData(paypalResData.data.id, orderEntity.id, 900);

    return serializerService.serializeResponse<{ orderId: string }>(
      'pending-order',
      {
        orderId: paypalResData.data.id,
      },
    );
  }

  async completePayment(orderId: string) {
    const orderRecordId = await this.redisService.getData(orderId);
    const orderEntity = await this.orderRepository.findOneBy({
      id: orderRecordId,
    });
    if (orderEntity.pend) {
      const paymentRes = {
        orderId: orderEntity.paypalId,
        amount: {
          currency: orderEntity.currency,
          value: orderEntity.total,
        },
        payee: orderEntity.payee,
        paytime: orderEntity.pay_time,
      };
      return serializerService.serializeResponse<any>(
        'successPayment',
        paymentRes,
      );
    }
    const access_token = await this.getPaypalAccessToken();
    const paypalOptions = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };
    const pyapalPaymentUrl = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`;
    const paypalResData = await lastValueFrom(
      this.httpService.post(pyapalPaymentUrl, null, paypalOptions).pipe(
        catchError((err) => {
          console.log(err);
          throw new NotImplementedException('Payment can not be implemented');
        }),
      ),
    );
    if (paypalResData.data.status === 'COMPLETED') {
      try {
        orderEntity.pend = true;
        orderEntity.pay_time = new Date();
        await this.orderRepository.save(orderEntity);

        const paymentRes = {
          orderId: paypalResData.data.id,
          amount:
            paypalResData.data.purchase_units[0].payments.captures[0].amount,
          payee: process.env.PAYPAL_BUSINESS_ACCOUNT,
          paytime: orderEntity.pay_time,
        };

        return serializerService.serializeResponse<any>(
          'successPayment',
          paymentRes,
        );
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException(
          'Order can not be record, please contact admin',
        );
      }
    } else {
      throw new BadRequestException('The payment is not completed');
    }
  }

  async cancelPaypalOrder(orderId: string) {
    const orderEntityId = await this.redisService.getData(orderId);
    const orderEntity = await this.orderRepository.findOne({
      where: {
        id: orderEntityId,
      },
      relations: ['user', 'items'],
    });

    //recover cart products
    const productIdList: string[] = [];
    orderEntity.items.map(async (item: OrderItemEntity) => {
      productIdList.push(item.productId);
    });
    const productItems: ProductEntity[] = await this.productRepository.findBy({
      id: In(productIdList),
    });
    if (productItems.length !== productIdList.length) {
      throw new UnprocessableEntityException('Cart ');
    }
    const cartItems: Partial<CartEntity>[] = [];
    for (let i = 0; i < productItems.length; i++) {
      cartItems.push({
        user: orderEntity.user,
        count: orderEntity.items[i].count,
        product: productItems[i],
      });
    }

    await this.cartRepository.save(cartItems);
    await this.orderItemRepository.remove(orderEntity.items);
    await this.orderRepository.remove(orderEntity);
    await this.redisService.deleteData(orderId);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Order has been canceled',
    });
  }

  async refundRequest(orderId: string, username: string) {
    const orderEntity = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: {
          username,
        },
      },
    });
    if (!orderEntity.pend) {
      throw new BadRequestException('This order is not paid!');
    } else if (orderEntity.ifRefund || orderEntity.toRefund) {
      throw new BadRequestException('Do not submit duplicated refund request!');
    }
    orderEntity.toRefund = true;
    await this.orderRepository.save(orderEntity);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Refund request is submitted',
    });
  }

  async refundOrder(orderId: string) {
    const orderEntity = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    if (!orderEntity.toRefund || !orderEntity.pend || orderEntity.ifRefund) {
      throw new BadRequestException('This is not a valid order for refunding');
    }
    const access_token = await this.getPaypalAccessToken();
    const paypalOptions = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };
    const pyapalPaymentUrl = `https://api-m.sandbox.paypal.com/v2/payments/captures/${orderEntity.paypalId}/refund`;
    const paypalResData = await lastValueFrom(
      this.httpService.post(pyapalPaymentUrl, null, paypalOptions).pipe(
        catchError((err) => {
          console.log(err);
          throw new NotImplementedException('Payment can not be implemented');
        }),
      ),
    );
    console.log(paypalResData);
    orderEntity.toRefund = false;
    orderEntity.ifRefund = true;
    await this.orderRepository.save(orderEntity);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Order is refunded',
    });
  }

  // address services
  async getUserAddress(username: string) {
    let user: UserEntity;
    try {
      user = await this.userRepository.findOne({
        where: { username },
        relations: ['address'],
      });
      if (!user) {
        throw new NotFoundException('No such user');
      }
    } catch (err) {
      throw new NotFoundException('No such user');
    }

    return serializerService.serializeResponse<AddressEntity[]>(
      'userAddress',
      user.address,
    );
  }

  async addUserAddress(dto: AddAddressDto, username: string) {
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

    const insertAddress = {
      user: user,
      ...dto,
    };

    await this.addressRepository.save(insertAddress);

    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Address has been added',
    });
  }

  async deleteUserAddress(addressId: string, username: string) {
    try {
      const address = await this.addressRepository.findOne({
        where: {
          id: addressId,
          user: {
            username: username,
          },
        },
        relations: ['user'],
      });
      if (!address) {
        throw new NotFoundException('No such address');
      }

      await this.addressRepository.remove(address);
    } catch (err) {
      throw new NotFoundException('No such address');
    }

    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Address has been deleted',
    });
  }

  private async getPaypalAccessToken() {
    const access_token = await this.redisService.getData('access_token');
    if (access_token) {
      await this.redisService.deleteData('access_token');
      return access_token;
    } else {
      const config = {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const accessTokenRes = await lastValueFrom(
        this.httpService.post(
          'https://api-m.sandbox.paypal.com/v1/oauth2/token',
          { grant_type: 'client_credentials' },
          config,
        ),
      );
      this.redisService.setData(
        'access_token',
        accessTokenRes.data.access_token,
        accessTokenRes.data.expires_in - 100,
      );
      return accessTokenRes.data.access_token;
    }
  }
}

import { BaseInfoRes } from '@/utils/http/axios/type';

export interface AddressItem {
  addressName: string;
  address: string;
  district: string;
}

export interface UserAddress extends AddressItem {
  addressDetail: string;
  name: string;
  phone: string;
}

export interface UserAddressRes extends UserAddress, BaseInfoRes {
  id: string;
}

interface CartItem {
  productId: string;
  count: number;
}

export interface OrderInfo {
  cartItems: CartItem[];
  addressId: string;
}

export interface OrderItem extends BaseInfoRes {
  count: number;
  productId: string;
  name: string;
  price: number;
  imagePath: string;
}

export interface OrderRes extends BaseInfoRes {
  items: OrderItem[];
  paypalId: string;
  payee: string;
  name: string;
  phone: string;
  addressInfo: string;
  total: number;
  currency: string;
  pay_time: string;
  user: string;
  pend: boolean;
  hide: boolean;
  toRefund: boolean;
  ifRefund: boolean;
}

export interface OrderFullRes extends OrderRes {
  user: string;
}

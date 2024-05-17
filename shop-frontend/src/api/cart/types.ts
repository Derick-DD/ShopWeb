import { BaseInfoRes } from '@/utils/http/axios/type';
import { UserInfo } from '../user/types';
import { ProductInfo } from '../product/types';

export interface CartItem {
  productId: string;
  count: number;
}

export interface CartInfo extends BaseInfoRes {
  count: number;
  product: ProductInfo;
  user: UserInfo;
}

import { BaseInfoRes } from '@/utils/http/axios/type';
import { ProductInfo } from '../product/types';

export interface CategoryInfo extends BaseInfoRes {
  name: string;
}

export interface CategoryFullInfo extends CategoryInfo {
  products: ProductInfo[];
}

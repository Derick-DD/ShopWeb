import { BaseInfoRes } from '@/utils/http/axios/type';
import { CategoryInfo } from '../category/types';

export interface ProductInfo extends BaseInfoRes {
  name: string;
  price: number;
  imagePath: string;
  description: string;
}

export interface ProductFullInfo extends ProductInfo {
  category: CategoryInfo;
}

export interface CreateProduct {
  name: string;
  imagePath: string;
  category: string;
  price: number;
  description?: string;
}

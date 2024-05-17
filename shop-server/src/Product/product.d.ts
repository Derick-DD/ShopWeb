import { ProductEntity } from '../Entity/product.entity';

export interface ProductList {
  count: number;
  products: ProductEntity;
}

export interface ProductImage {
  imagePath: string;
}

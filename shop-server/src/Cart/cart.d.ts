import { ProductEntity } from '../Entity/product.entity';
import { UserEntity } from '../Entity/user.entity';

export interface CartValues {
  user: UserEntity;
  product: ProductEntity;
  count: number;
}

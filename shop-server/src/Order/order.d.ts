import { OrderEntity } from 'src/Entity/order.entity';

export interface OrderItemRes extends OrderEntity {
  user: string;
}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('OrderItem')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;

  @Column({
    type: 'int',
  })
  count: number;

  //directly save the product info
  @Column({
    type: 'varchar',
  })
  productId: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'default-product-img.png',
  })
  imagePath: string;
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity('Cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
  })
  count: number;

  @ManyToOne(() => ProductEntity, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.cart, { nullable: false })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

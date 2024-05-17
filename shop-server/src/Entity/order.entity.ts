import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderItemEntity } from './orderItem.entity';

@Entity('Order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  paypalId: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  payee: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  addressInfo: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'HKD',
  })
  currency: string;

  @Column({ type: 'timestamptz', nullable: true })
  pay_time: Date;

  @OneToMany(() => OrderItemEntity, (items) => items.order, {
    cascade: true,
  })
  items: OrderItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.order)
  user: UserEntity;

  @Column({
    type: 'boolean',
    default: false,
  })
  pend: boolean; // = true if the order is paid

  @Column({
    type: 'boolean',
    default: false,
  })
  hide: boolean; // = true if user delete their order record

  @Column({
    type: 'boolean',
    default: false,
  })
  toRefund: boolean; // = true if user asked to refund

  @Column({
    type: 'boolean',
    default: false,
  })
  ifRefund: boolean; // = true if the order is refunded

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

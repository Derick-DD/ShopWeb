import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { AddressEntity } from './address.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 17,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 80,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: '',
  })
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  googleId: string;

  @Column({
    type: 'varchar',
    length: 80,
    unique: true,
    nullable: true,
  })
  googleEmail: string;

  @Column({
    default: '',
    type: 'varchar',
    length: 255,
  })
  biography: string;

  @Column({
    default: 0,
    type: 'smallint',
  })
  role: number;

  @OneToMany(() => CartEntity, (cart) => cart.user, {
    nullable: true,
    cascade: true,
  })
  cart: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user, {
    nullable: true,
  })
  order: OrderEntity[];

  @OneToMany(() => AddressEntity, (address) => address.user, {
    nullable: true,
  })
  address: AddressEntity[];

  @Column({
    type: 'varchar',
    default: '',
  })
  refresh_token: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  recovery_key: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_banned: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

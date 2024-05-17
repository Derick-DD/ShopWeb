import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

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

  @Column({
    default: '',
    type: 'varchar',
    length: 255,
  })
  description: string;

  // @Column({
  //   type: 'boolean',
  //   default: false,
  // })
  // is_abandoned: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

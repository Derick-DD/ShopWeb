import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Address')
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  addressName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  district: string;

  @Column({
    default: '',
    type: 'varchar',
    length: 255,
  })
  addressDetail: string;

  @ManyToOne(() => UserEntity, (user) => user.address)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

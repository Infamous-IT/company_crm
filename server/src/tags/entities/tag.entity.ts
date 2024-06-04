import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @ManyToOne(() => User, user => user.tags, {
    onDelete: 'SET NULL',
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToOne(() => Order, order => order.tags, {
    onDelete: 'SET NULL',
    lazy: true,
  })
  @JoinColumn({ name: 'order_id' })
  @ApiProperty({ type: () => Order })
  order: Order;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}

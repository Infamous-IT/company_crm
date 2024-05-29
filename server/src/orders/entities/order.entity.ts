import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Status } from '../../utils/enums/status';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  uniqueName: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  isComplete: boolean;

  @Column()
  estimatedTime: Date;

  @Column({ type: 'enum', enum: Status, default: Status.NEW })
  status: Status;

  @OneToMany(() => Tag, tag => tag.order, {
    onDelete: 'CASCADE',
  })
  tags: Tag[];

  @ManyToOne(() => User, user => user.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Customer, customer => customer.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

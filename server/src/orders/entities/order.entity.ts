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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column({ unique: true })
  @ApiProperty()
  uniqueName: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  isComplete: boolean;

  @Column()
  @ApiProperty()
  estimatedTime: Date;

  @Column({ type: 'enum', enum: Status, default: Status.NEW })
  @ApiProperty()
  status: Status;

  @OneToMany(() => Tag, tag => tag.order, {
    onDelete: 'CASCADE',
    lazy: true
  })
  @ApiProperty({ type: () => [Tag] })
  tags: Tag[];

  @ManyToOne(() => User, user => user.orders, {
    onDelete: 'SET NULL',
    lazy: true
  })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToOne(() => Customer, customer => customer.orders, {
    onDelete: 'SET NULL',
    lazy: true
  })
  @JoinColumn({ name: 'customer_id' })
  @ApiProperty({ type: () => Customer })
  customer: Customer;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}

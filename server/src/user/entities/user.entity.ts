import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Order } from '../../orders/entities/order.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Roles } from '../../utils/enums/roles';
import { Customer } from 'src/customer/entities/customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  uniqueId: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ default: 0 })
  income: number;

  @Column({ default: 0 })
  costs: number;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;

  @OneToMany(() => Order, order => order.user, {
    onDelete: 'CASCADE',
  })
  orders: Order[];

  @OneToMany(() => Tag, tag => tag.user, {
    onDelete: 'CASCADE',
  })
  tags: Tag[];

  @OneToMany(() => Customer, customer => customer.user)
  customers: Customer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

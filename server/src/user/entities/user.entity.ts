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
import { Customer } from '../../customer/entities/customer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  firstName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ nullable: true })
  @ApiProperty()
  uniqueId: string;

  @Column({ nullable: true })
  @ApiProperty()
  photoUrl: string;

  @Column({ default: 0 })
  @ApiProperty()
  income: number;

  @Column({ default: 0 })
  @ApiProperty()
  costs: number;

  @Column({ type: 'enum', enum: Roles })
  @ApiProperty()
  role: Roles;

  @OneToMany(() => Order, order => order.user, {
    onDelete: 'CASCADE',
  })
  @ApiProperty()
  orders: Order[];

  @OneToMany(() => Tag, tag => tag.user, {
    onDelete: 'CASCADE',
  })
  @ApiProperty()
  tags: Tag[];

  @OneToMany(() => Customer, customer => customer.user)
  @ApiProperty()
  customers: Customer[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}

import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {User} from '../../user/entities/user.entity';
import {Order} from '../../orders/entities/order.entity';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @ManyToOne(() => User, (user) => user.customers, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Order, (order) => order.customer, {
        onDelete: 'CASCADE'
    })
    orders: Order[];
}

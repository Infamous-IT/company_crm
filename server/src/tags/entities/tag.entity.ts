import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import {User} from '../../user/entities/user.entity';
import {Order} from '../../orders/entities/order.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @ManyToOne(() => User, (user) => user.tags, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Order, (order) => order.tags, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

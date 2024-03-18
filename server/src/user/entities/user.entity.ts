import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {OneToMany} from 'typeorm/decorator/relations/OneToMany';
import {Order} from '../../orders/entities/order.entity';
import {Tag} from '../../tags/entities/tag.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @OneToMany(() => Order, (order) => order.user, {
        onDelete: 'CASCADE'
    })
    orders: Order[];

    @OneToMany(() => Tag, (tag) => tag.user, {
        onDelete: 'CASCADE'
    })
    tags: Tag[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

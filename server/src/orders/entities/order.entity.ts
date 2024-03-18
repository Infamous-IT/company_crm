import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import {Tag} from '../../tags/entities/tag.entity';
import {User} from '../../user/entities/user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    customer: string; // can be string or []

    @Column()
    isComplete: boolean;

    @Column()
    estimatedTime: Date;

    @OneToMany(() => Tag, (tag) => tag.order, {
        onDelete: 'CASCADE'
    })
    tags: Tag[];

    @ManyToOne(() => User, (user) => user.orders, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({name: 'user_id'})
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

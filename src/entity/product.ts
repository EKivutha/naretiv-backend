import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { Order } from './order';
import { User } from './user';

@Entity('products')
export class Product extends Model {

    @ManyToOne(()=>User, (user) => user.products)
    @JoinColumn()
    user: User;

    @OneToMany(()=>Order, (order) => order.product)
    @JoinColumn()
    order: Order[];

    @Column()
    product_name: string;

    @Column()
    product_cost: number;


}
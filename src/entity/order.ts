import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { Product } from './product';

import { Shipment } from './shipment';
import { User } from './user';

@Entity('orders')
export class Order extends Model {

    @ManyToOne(()=>User, (user) => user.message)
    @JoinColumn()
    user: User;

    @ManyToOne(()=>Product, (product) => product.order)
    @JoinColumn()
    product: Product;

    @ManyToOne(()=>Shipment, (shipment) => shipment.order)
    @JoinColumn()
    shipment: Shipment;

    @Column()
    order_price: number;



}
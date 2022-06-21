import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { Order } from './order';
import { Rider } from './rider';
import { User } from './user';

@Entity('shipments')
export class Shipment extends Model {

    @OneToMany(()=>Order, (order) => order.shipment)
    @JoinColumn()
    order: Order[];

    @ManyToOne(()=>Rider, (rider) => rider.shipment)
    @JoinColumn()
    rider:Rider;

    @Column()
    shipment_date: string;

    @Column()
    dispatcher_name: string;

    @Column()
    delivery_admin: string

    @Column()
    distance_traveled: number;

    @Column()
    shipment_cost: number;


}
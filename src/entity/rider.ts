import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { Order } from './order';
import { Shipment } from './shipment';

@Entity('riders')
export class Rider extends Model {

    @OneToMany(()=>Shipment, (shipment) => shipment.order)
    @JoinColumn()
    shipment: Shipment[];

    @Column()
    name: string;

    @Column()
    phone_number: number;


}
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { User } from './User';

@Entity('posts')
export class Product extends Model {

    @ManyToOne(()=>User, (user) => user.products)
    @JoinColumn()
    user: User;

    @Column()
    product_name: string;

    @Column()
    product_cost: number;


}
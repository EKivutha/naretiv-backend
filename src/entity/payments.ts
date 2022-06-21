import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { Order } from './order';
import { Product } from './product';
import { User } from './user';


export enum TransactionEnumType {
    WITHDRAWAL = 'withdrawal',
    DEPOSIT = 'deposit',
    ESCROW = 'escrow',
  }

export enum OutcomeEnumType {
    SUCCESS = 'success',
    FAIL = 'fail'
  }


@Entity('payments')
export class Payment extends Model {

    @ManyToOne(()=>User, (user) => user.message)
    @JoinColumn()
    user: User;

    // @ManyToOne(()=>Order, (order) => order.id)
    // @JoinColumn()
    // order: Order;

    @Column()
    payment_name: string;

    @Column()
    payment_type: TransactionEnumType;

    @Column()
    payment_outcome: OutcomeEnumType;

    @Column()
    total_transacted: number;

}
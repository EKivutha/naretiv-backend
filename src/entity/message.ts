import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import {User}  from './user';

@Entity('messages')
export class Message extends Model {

    @ManyToMany(()=>User, (user) => user.received_message)
    @JoinTable()
    user_to: User[];

    @ManyToMany(()=>User, (user) => user.sent_message)
    @JoinTable()
    user: User[];

    @Column()
    receiver_id: string;

    @Column()
    message_body: string;


}

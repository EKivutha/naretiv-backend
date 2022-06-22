import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { User } from './user';

@Entity('messages')
export class Message extends Model {

    @ManyToMany(()=>User, (user) => user.received_message)
    @JoinColumn()
    user_to: User;

    @ManyToOne(()=>User, (user) => user.sent_message)
    @JoinColumn()
    user: User;

    @Column()
    receiver_id: string;

    @Column()
    message_body: string;


}
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { User } from './user';

@Entity('messages')
export class Message extends Model {

    @OneToMany(()=>User, (user) => user.message)
    @JoinColumn()
    user_to: User[];

    // @ManyToOne(()=>User, (user) => user.message)
    // @JoinColumn()
    // user_from: User;

    @Column()
    receiver_id: string;

    @Column()
    message_body: number;


}
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Model from './model';
import { User } from './User';

@Entity('posts')
export class Message extends Model {

    @ManyToOne(()=>User, (user) => user.message)
    @JoinColumn()
    user: User;

    @Column()
    receiver_id: string;

    @Column()
    message_body: number;


}
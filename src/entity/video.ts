import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, ManyToOne, BeforeInsert, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm"
import * as bcrypt from "bcryptjs";
import crypto from 'crypto';
import Model from "./model";
import { Message } from "./message";

@Entity('video')
export class Video extends Model {

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  quality: string

  @Column()
  video_link: string;
  
}

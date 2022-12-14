import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, ManyToOne, BeforeInsert, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm"
import * as bcrypt from "bcryptjs";
export enum RoleEnumType {
  VIEWER = 'viewer',
  ADMIN = 'admin',
}
import crypto from 'crypto';
import Model from "./model";
import  {Message}  from "./message";

@Entity('users')
export class User extends Model {

  @Column()
  name!: string;

  @Index('email_index')
  @Column({
    unique: true
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: RoleEnumType,
    // default: RoleEnumType.BUYER,
  })
  role!: RoleEnumType;

  @Column()
  age: number

  @Column({
    default: false
  })
  verified: boolean;

  @Column()
  account_balance: number = 0;

  @Index('verificationCode_index')
  @Column({
    type: 'text',
    nullable: true
  })
  verificationCode!: string | null;
  // User can create multiple message and a single message can belong to one sender
  @ManyToMany(() => Message, (message) => message.user)
  @JoinTable()
  sent_message!: Message[]

  @ManyToMany(() => Message, (message) => message.user_to)
  @JoinTable()
  received_message!: Message[]

  static findByName(name: string, lastName: string) {
    return this.createQueryBuilder("user")
      .where("user.name = :firstName", { name })
      .getMany()
  }
  static findByRole(role: string) {
    return this.createQueryBuilder("user")
      .where("user.role = :role", { role })
      .getMany()
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // 👇 Validate password
  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString('hex');

    const hashVerificationCode = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');

    return { verificationCode, hashVerificationCode }
  }
}

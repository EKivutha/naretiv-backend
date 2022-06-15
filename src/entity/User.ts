import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, ManyToOne, BeforeInsert } from "typeorm"
import * as bcrypt from "bcryptjs";
import Model from "./model";
export enum RoleEnumType {
    BUYER = 'buyer',
    SELLER = 'seller',
    ADMIN = 'admin',
}

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
    default: RoleEnumType.BUYER,
  })
  role!: RoleEnumType;

  @Column()
  age: number

//   @ManyToOne(() => Message, (message) => message.id)
//   messages!: Message

//   @ManyToOne(() => Message, (product) => product.id)
//   products!: Product

//   @ManyToOne(() => Message, (orders) => orders.id)
//   orders!: Order

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
}

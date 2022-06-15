import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { RoleEnumType, User } from "../entity/User";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.name = "admin";
    user.password = "admin";
    user.hashPassword();
    user.role = RoleEnumType.ADMIN;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
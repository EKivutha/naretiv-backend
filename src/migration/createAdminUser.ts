import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { AppDataSource } from "../utils/data-source";
import { RoleEnumType, User } from "../entity/user";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.name = "admin";
    user.password = "admin";
    user.hashPassword();
    user.role = RoleEnumType.ADMIN;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
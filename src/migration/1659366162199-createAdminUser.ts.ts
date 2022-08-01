import { MigrationInterface, QueryRunner } from "typeorm";

export class createAdminUser.ts1659366162199 implements MigrationInterface {
    name = 'createAdminUser.ts1659366162199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('buyer', 'seller', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "age" integer NOT NULL, "verified" boolean NOT NULL DEFAULT false, "account_balance" integer NOT NULL, "verificationCode" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "email_index" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "verificationCode_index" ON "users" ("verificationCode") `);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "receiver_id" character varying NOT NULL, "message_body" character varying NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_sent_message_messages" ("usersId" uuid NOT NULL, "messagesId" uuid NOT NULL, CONSTRAINT "PK_6b5854037ab00a412dad58e5889" PRIMARY KEY ("usersId", "messagesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a09d4c1ef93e81777ebafd1a70" ON "users_sent_message_messages" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad1f97d74fffcf0c2ca9b514b8" ON "users_sent_message_messages" ("messagesId") `);
        await queryRunner.query(`CREATE TABLE "users_received_message_messages" ("usersId" uuid NOT NULL, "messagesId" uuid NOT NULL, CONSTRAINT "PK_21d8ac07946f1570280bab08ac9" PRIMARY KEY ("usersId", "messagesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc1158b7f9b2f4a466abfe570b" ON "users_received_message_messages" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_000234962b1311f325ae948b02" ON "users_received_message_messages" ("messagesId") `);
        await queryRunner.query(`CREATE TABLE "messages_user_to_users" ("messagesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_bd7065be7a88b9c307861cd8ab8" PRIMARY KEY ("messagesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc798d2b573e1d3259c4a8a1ba" ON "messages_user_to_users" ("messagesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f062c6b9b4bb5a3b12a7b41a66" ON "messages_user_to_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "messages_user_users" ("messagesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_207dde31e9a3a141aec433c1690" PRIMARY KEY ("messagesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c80001843a7385c770b5e55389" ON "messages_user_users" ("messagesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_60def4af424b60c9db4c1610dd" ON "messages_user_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "users_sent_message_messages" ADD CONSTRAINT "FK_a09d4c1ef93e81777ebafd1a706" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_sent_message_messages" ADD CONSTRAINT "FK_ad1f97d74fffcf0c2ca9b514b88" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_received_message_messages" ADD CONSTRAINT "FK_cc1158b7f9b2f4a466abfe570b3" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_received_message_messages" ADD CONSTRAINT "FK_000234962b1311f325ae948b024" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages_user_to_users" ADD CONSTRAINT "FK_bc798d2b573e1d3259c4a8a1baa" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages_user_to_users" ADD CONSTRAINT "FK_f062c6b9b4bb5a3b12a7b41a667" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages_user_users" ADD CONSTRAINT "FK_c80001843a7385c770b5e553896" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "messages_user_users" ADD CONSTRAINT "FK_60def4af424b60c9db4c1610dd4" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_user_users" DROP CONSTRAINT "FK_60def4af424b60c9db4c1610dd4"`);
        await queryRunner.query(`ALTER TABLE "messages_user_users" DROP CONSTRAINT "FK_c80001843a7385c770b5e553896"`);
        await queryRunner.query(`ALTER TABLE "messages_user_to_users" DROP CONSTRAINT "FK_f062c6b9b4bb5a3b12a7b41a667"`);
        await queryRunner.query(`ALTER TABLE "messages_user_to_users" DROP CONSTRAINT "FK_bc798d2b573e1d3259c4a8a1baa"`);
        await queryRunner.query(`ALTER TABLE "users_received_message_messages" DROP CONSTRAINT "FK_000234962b1311f325ae948b024"`);
        await queryRunner.query(`ALTER TABLE "users_received_message_messages" DROP CONSTRAINT "FK_cc1158b7f9b2f4a466abfe570b3"`);
        await queryRunner.query(`ALTER TABLE "users_sent_message_messages" DROP CONSTRAINT "FK_ad1f97d74fffcf0c2ca9b514b88"`);
        await queryRunner.query(`ALTER TABLE "users_sent_message_messages" DROP CONSTRAINT "FK_a09d4c1ef93e81777ebafd1a706"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60def4af424b60c9db4c1610dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c80001843a7385c770b5e55389"`);
        await queryRunner.query(`DROP TABLE "messages_user_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f062c6b9b4bb5a3b12a7b41a66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc798d2b573e1d3259c4a8a1ba"`);
        await queryRunner.query(`DROP TABLE "messages_user_to_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_000234962b1311f325ae948b02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc1158b7f9b2f4a466abfe570b"`);
        await queryRunner.query(`DROP TABLE "users_received_message_messages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad1f97d74fffcf0c2ca9b514b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a09d4c1ef93e81777ebafd1a70"`);
        await queryRunner.query(`DROP TABLE "users_sent_message_messages"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP INDEX "public"."verificationCode_index"`);
        await queryRunner.query(`DROP INDEX "public"."email_index"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}

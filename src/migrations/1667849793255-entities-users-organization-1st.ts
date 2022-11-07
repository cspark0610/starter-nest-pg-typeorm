import {MigrationInterface, QueryRunner} from "typeorm";

export class entitiesUsersOrganization1st1667849793255 implements MigrationInterface {
    name = 'entitiesUsersOrganization1st1667849793255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "subdomain" character varying NOT NULL, "aws_s3_bucket" character varying NOT NULL, "user_id" integer, CONSTRAINT "UQ_5eb99d5c5ea8e100c7b381cc7d9" UNIQUE ("subdomain"), CONSTRAINT "REL_b93269ca4d9016837d22ab6e1e" UNIQUE ("user_id"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_b93269ca4d9016837d22ab6e1e0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_b93269ca4d9016837d22ab6e1e0"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

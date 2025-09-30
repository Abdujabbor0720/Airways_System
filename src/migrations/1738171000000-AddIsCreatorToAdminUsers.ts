import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCreatorToAdminUsers1738171000000 implements MigrationInterface {
    name = 'AddIsCreatorToAdminUsers1738171000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_users" ADD COLUMN "is_creator" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "is_creator"`);
    }
}


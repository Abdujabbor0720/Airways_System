import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewsImageColumns1738170000000 implements MigrationInterface {
    name = 'AddNewsImageColumns1738170000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" ADD COLUMN "image_url" text`);
        await queryRunner.query(`ALTER TABLE "news" ADD COLUMN "image_key" text`);
        await queryRunner.query(`ALTER TABLE "news" ADD COLUMN "image_content_type" text`);
        await queryRunner.query(`ALTER TABLE "news" ADD COLUMN "image_size" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "image_size"`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "image_content_type"`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "image_key"`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "image_url"`);
    }
}


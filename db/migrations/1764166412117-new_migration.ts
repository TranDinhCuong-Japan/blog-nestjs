import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1764166412117 implements MigrationInterface {
    name = 'NewMigration1764166412117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`avatar\``);
    }

}

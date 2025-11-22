import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1763651301879 implements MigrationInterface {
    name = 'NewMigration1763651301879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`birthDay\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`birthDay\``);
    }

}

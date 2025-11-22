import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1763650346013 implements MigrationInterface {
    name = 'NewMigration1763650346013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`email\``);
    }

}

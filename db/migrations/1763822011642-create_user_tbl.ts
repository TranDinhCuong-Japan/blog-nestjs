import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTbl1763822011642 implements MigrationInterface {
    name = 'CreateUserTbl1763822011642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`birthDay\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`phoneNumber\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`refresh_token\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`status\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`phoneNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`isActive\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`my_users\` ADD \`birthDay\` varchar(255) NOT NULL`);
    }

}

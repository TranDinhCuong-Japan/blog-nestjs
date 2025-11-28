import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1764340049443 implements MigrationInterface {
    name = 'NewMigration1764340049443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_8aae16569ab47ce1adb628f487c\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`postId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_8aae16569ab47ce1adb628f487c\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

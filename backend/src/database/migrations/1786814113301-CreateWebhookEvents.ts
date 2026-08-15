import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWebhookEvents1786814113301 implements MigrationInterface {
    name = 'CreateWebhookEvents1786814113301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`webhook_events\` (\`id\` varchar(36) NOT NULL, \`event\` varchar(255) NOT NULL, \`external_reference\` varchar(255) NULL, \`gateway_entity_id\` varchar(255) NULL, \`payload\` json NOT NULL, \`processed_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`webhook_events\``);
    }

}

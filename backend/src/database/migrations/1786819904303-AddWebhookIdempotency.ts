import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookIdempotency1786819904303 implements MigrationInterface {
    name = 'AddWebhookIdempotency1786819904303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`webhook_events\` ADD UNIQUE INDEX \`IDX_741ed8da520da35e0a94dc18c4\` (\`gateway_entity_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`webhook_events\` DROP INDEX \`IDX_741ed8da520da35e0a94dc18c4\``);
    }

}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWebhookEvents1786814113301 = void 0;
class CreateWebhookEvents1786814113301 {
    name = 'CreateWebhookEvents1786814113301';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`webhook_events\` (\`id\` varchar(36) NOT NULL, \`event\` varchar(255) NOT NULL, \`external_reference\` varchar(255) NULL, \`gateway_entity_id\` varchar(255) NULL, \`payload\` json NOT NULL, \`processed_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`webhook_events\``);
    }
}
exports.CreateWebhookEvents1786814113301 = CreateWebhookEvents1786814113301;
//# sourceMappingURL=1786814113301-CreateWebhookEvents.js.map
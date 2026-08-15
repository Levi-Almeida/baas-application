"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutLinks1786802045444 = void 0;
class CreateCheckoutLinks1786802045444 {
    name = 'CreateCheckoutLinks1786802045444';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`checkout_links\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`paymentMethod\` enum ('PIX', 'CARD') NOT NULL, \`amount\` int NOT NULL COMMENT 'Valor em centavos', \`external_reference\` varchar(255) NOT NULL, \`status\` enum ('PENDING', 'APPROVED', 'DENIED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING', \`gateway_payment_id\` varchar(255) NULL, \`txid\` varchar(255) NULL, \`qr_code_base64\` longtext NULL, \`emv\` text NULL, \`fee_percent\` decimal(5,2) NULL, \`installments\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9964632142499d5ca4fde5c292\` (\`external_reference\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_9964632142499d5ca4fde5c292\` ON \`checkout_links\``);
        await queryRunner.query(`DROP TABLE \`checkout_links\``);
    }
}
exports.CreateCheckoutLinks1786802045444 = CreateCheckoutLinks1786802045444;
//# sourceMappingURL=1786802045444-CreateCheckoutLinks.js.map
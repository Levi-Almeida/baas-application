"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersAndGatewayAccounts1786733415277 = void 0;
class CreateUsersAndGatewayAccounts1786733415277 {
    name = 'CreateUsersAndGatewayAccounts1786733415277';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(150) NOT NULL, \`email\` varchar(255) NOT NULL, \`document\` varchar(255) NOT NULL, \`person_type\` varchar(2) NOT NULL, \`trading_name\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_c1b20b2a1883ed106c3e746c25\` (\`document\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`gateway_accounts\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`gateway_user_id\` varchar(255) NOT NULL, \`codigo_cliente\` int NOT NULL, \`chave_loja\` varchar(255) NOT NULL, \`access_token\` text NOT NULL, \`token_type\` varchar(255) NOT NULL DEFAULT 'Bearer', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a2c3e2b592f5d648852e92644c\` (\`user_id\`), UNIQUE INDEX \`REL_a2c3e2b592f5d648852e92644c\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`gateway_accounts\` ADD CONSTRAINT \`FK_a2c3e2b592f5d648852e92644c5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`gateway_accounts\` DROP FOREIGN KEY \`FK_a2c3e2b592f5d648852e92644c5\``);
        await queryRunner.query(`DROP INDEX \`REL_a2c3e2b592f5d648852e92644c\` ON \`gateway_accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_a2c3e2b592f5d648852e92644c\` ON \`gateway_accounts\``);
        await queryRunner.query(`DROP TABLE \`gateway_accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1b20b2a1883ed106c3e746c25\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.CreateUsersAndGatewayAccounts1786733415277 = CreateUsersAndGatewayAccounts1786733415277;
//# sourceMappingURL=1786733415277-CreateUsersAndGatewayAccounts.js.map
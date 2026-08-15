import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWithdrawals1786811744071 implements MigrationInterface {
    name = 'CreateWithdrawals1786811744071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`withdrawals\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`amount\` int NOT NULL COMMENT 'Valor em centavos', \`pix_key\` varchar(255) NOT NULL, \`document\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`external_reference\` varchar(255) NOT NULL, \`gateway_withdrawal_id\` varchar(255) NULL, \`status\` varchar(255) NOT NULL DEFAULT 'PENDING', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_55f0f728374bff9998f822e2ba\` (\`external_reference\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_55f0f728374bff9998f822e2ba\` ON \`withdrawals\``);
        await queryRunner.query(`DROP TABLE \`withdrawals\``);
    }

}

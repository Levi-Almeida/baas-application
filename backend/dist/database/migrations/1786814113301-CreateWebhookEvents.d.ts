import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateWebhookEvents1786814113301 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

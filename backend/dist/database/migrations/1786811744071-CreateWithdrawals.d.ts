import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateWithdrawals1786811744071 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

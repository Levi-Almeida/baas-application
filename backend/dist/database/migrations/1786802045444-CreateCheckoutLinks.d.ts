import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateCheckoutLinks1786802045444 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

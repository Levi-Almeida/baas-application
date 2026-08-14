import { Repository } from 'typeorm';
import { GatewayAccount } from './entities/gateway-account.entity';
export declare class GatewayAccountsService {
    private readonly repository;
    constructor(repository: Repository<GatewayAccount>);
    findByUserId(userId: string): Promise<GatewayAccount | null>;
    create(data: {
        userId: string;
        gatewayUserId: string;
        codigoCliente: number;
        chaveLoja: string;
        accessToken: string;
        tokenType: string;
    }): Promise<GatewayAccount>;
    updateToken(id: string, accessToken: string, tokenType: string): Promise<void>;
}

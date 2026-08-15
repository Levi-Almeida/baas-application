import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
export declare class WalletService {
    private readonly gatewayService;
    private readonly gatewayAccountsService;
    constructor(gatewayService: GatewayService, gatewayAccountsService: GatewayAccountsService);
    getWallet(userId: string): Promise<any>;
    getTransactions(userId: string, filters?: {
        status?: string;
        type?: string;
        limit?: number;
    }): Promise<any>;
}

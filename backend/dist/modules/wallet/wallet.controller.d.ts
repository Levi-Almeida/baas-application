import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(request: {
        user: {
            userId: string;
            email: string;
        };
    }): Promise<any>;
    getTransactions(request: {
        user: {
            userId: string;
            email: string;
        };
    }, status?: string, type?: string, limit?: string): Promise<any>;
}

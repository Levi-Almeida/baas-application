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
}

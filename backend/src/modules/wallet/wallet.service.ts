import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';

@Injectable()
export class WalletService {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly gatewayAccountsService: GatewayAccountsService,
    ) { }

    async getWallet(userId: string) {
        const gatewayAccount =
            await this.gatewayAccountsService.findByUserId(
                userId,
            );

        if (!gatewayAccount) {
            throw new NotFoundException(
                'Conta do gateway não encontrada',
            );
        }

        return this.gatewayService.getWallet(
            gatewayAccount.accessToken,
        );
    }

    async getTransactions(
        userId: string,
        filters?: {
            status?: string;
            type?: string;
            limit?: number;
        },
    ) {
        const gatewayAccount =
            await this.gatewayAccountsService.findByUserId(userId);

        if (!gatewayAccount) {
            throw new NotFoundException(
                'Conta do gateway não encontrada',
            );
        }

        return this.gatewayService.getWalletTransactions(
            gatewayAccount.accessToken,
            filters,
        );
    }
}
import { Repository } from 'typeorm';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { Withdrawal } from './entities/withdrawal.entity';
export declare class WithdrawalsService {
    private readonly withdrawalRepository;
    private readonly gatewayService;
    private readonly gatewayAccountsService;
    constructor(withdrawalRepository: Repository<Withdrawal>, gatewayService: GatewayService, gatewayAccountsService: GatewayAccountsService);
    create(userId: string, dto: CreateWithdrawalDto): Promise<{
        id: string;
        gatewayWithdrawalId: string | undefined;
        externalReference: string;
        status: string;
        amount: number;
    }>;
    findOne(userId: string, withdrawalId: string): Promise<Withdrawal | {
        id: string;
        externalReference: string;
        status: string;
        amount: number;
        gateway: any;
    }>;
}

import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { WithdrawalsService } from './withdrawals.service';
export declare class WithdrawalsController {
    private readonly withdrawalsService;
    constructor(withdrawalsService: WithdrawalsService);
    create(request: {
        user: {
            userId: string;
            email: string;
        };
    }, dto: CreateWithdrawalDto): Promise<{
        id: string;
        gatewayWithdrawalId: string | undefined;
        externalReference: string;
        status: string;
        amount: number;
    }>;
    findOne(request: {
        user: {
            userId: string;
            email: string;
        };
    }, id: string): Promise<import("./entities/withdrawal.entity").Withdrawal | {
        id: string;
        externalReference: string;
        status: string;
        amount: number;
        gateway: any;
    }>;
}

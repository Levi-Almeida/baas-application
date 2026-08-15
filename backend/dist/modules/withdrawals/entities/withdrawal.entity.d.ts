export declare class Withdrawal {
    id: string;
    userId: string;
    amount: number;
    pixKey: string;
    document: string;
    description: string;
    externalReference: string;
    gatewayWithdrawalId?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

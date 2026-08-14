import { GatewayAccount } from '../../gateway-accounts/entities/gateway-account.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    document: string;
    personType: 'PF' | 'PJ';
    tradingName?: string;
    createdAt: Date;
    updatedAt: Date;
    gatewayAccount: GatewayAccount;
}

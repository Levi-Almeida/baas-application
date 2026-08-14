import { User } from '../../users/entities/user.entity';
export declare class GatewayAccount {
    id: string;
    userId: string;
    user: User;
    gatewayUserId: string;
    codigoCliente: number;
    chaveLoja: string;
    accessToken: string;
    tokenType: string;
    createdAt: Date;
    updatedAt: Date;
}

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RegisterGatewayUserDto } from './dtos/register-gateway-user.dto';
export declare class GatewayService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    registerUser(data: RegisterGatewayUserDto): Promise<any>;
    login(document: string, password: string): Promise<any>;
    getWallet(accessToken: string): Promise<any>;
    getWalletTransactions(accessToken: string, filters?: {
        status?: string;
        type?: string;
        limit?: number;
    }): Promise<any>;
    getFees(brand?: 'VISA' | 'MASTERCARD' | 'ELO'): Promise<any>;
    createPixPayment(accessToken: string, data: {
        amount: number;
        description: string;
        payerDocument: string;
        externalReference: string;
    }): Promise<any>;
}

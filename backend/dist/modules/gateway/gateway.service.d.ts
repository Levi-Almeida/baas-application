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
    createCardPayment(accessToken: string, data: {
        amount: number;
        description: string;
        externalReference: string;
        cardNumber: string;
        cardHolder: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        installments: number;
        feePercent: number;
    }): Promise<any>;
    createWithdrawal(accessToken: string, data: {
        amount: number;
        pixKey: string;
        description: string;
        externalReference: string;
        document: string;
    }): Promise<any>;
    getWithdrawal(accessToken: string, withdrawalId: string): Promise<any>;
    getWebhooks(accessToken: string): Promise<any>;
    registerWebhook(accessToken: string, data: {
        event: 'PAYMENT_PIX' | 'PAYMENT_CARD' | 'WITHDRAWAL';
        url: string;
        secret: string;
    }): Promise<any>;
}

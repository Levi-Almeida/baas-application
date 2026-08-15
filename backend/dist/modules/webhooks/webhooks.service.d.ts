import { ConfigService } from '@nestjs/config';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
export declare class WebhooksService {
    private readonly gatewayService;
    private readonly gatewayAccountsService;
    private readonly configService;
    constructor(gatewayService: GatewayService, gatewayAccountsService: GatewayAccountsService, configService: ConfigService);
    configure(userId: string): Promise<{
        message: string;
        webhooks: unknown[];
    }>;
    private validateSignature;
    process(event: string, payload: Record<string, unknown>, signature?: string): Promise<{
        received: boolean;
    }>;
}

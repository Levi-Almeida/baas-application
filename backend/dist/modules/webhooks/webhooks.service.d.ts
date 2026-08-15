import { ConfigService } from '@nestjs/config';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { CheckoutService } from '../checkout/checkout.service';
import { WebhookEvent } from './entities/webhook-event.entity';
import { Repository } from 'typeorm';
import { LeraBoxWebhookPayload } from './interfaces/lera-box-webhook-payload.interface';
export declare class WebhooksService {
    private readonly webhookEventRepository;
    private readonly gatewayService;
    private readonly gatewayAccountsService;
    private readonly configService;
    private readonly checkoutService;
    constructor(webhookEventRepository: Repository<WebhookEvent>, gatewayService: GatewayService, gatewayAccountsService: GatewayAccountsService, configService: ConfigService, checkoutService: CheckoutService);
    configure(userId: string): Promise<{
        message: string;
        webhooks: unknown[];
    }>;
    private validateSignature;
    process(event: 'PAYMENT_PIX' | 'PAYMENT_CARD' | 'WITHDRAWAL', payload: LeraBoxWebhookPayload, signature?: string): Promise<{
        received: boolean;
    }>;
}

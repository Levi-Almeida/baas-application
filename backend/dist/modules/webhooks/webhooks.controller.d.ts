import { WebhooksService } from './webhooks.service';
import * as leraBoxWebhookPayloadInterface from './interfaces/lera-box-webhook-payload.interface';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    receivePix(payload: leraBoxWebhookPayloadInterface.LeraBoxWebhookPayload, signature?: string): Promise<{
        received: boolean;
    }>;
    receiveCard(payload: leraBoxWebhookPayloadInterface.LeraBoxWebhookPayload, signature?: string): Promise<{
        received: boolean;
    }>;
    receiveWithdrawal(payload: leraBoxWebhookPayloadInterface.LeraBoxWebhookPayload, signature?: string): Promise<{
        received: boolean;
    }>;
    configure(request: {
        user: {
            userId: string;
        };
    }): Promise<{
        message: string;
        webhooks: unknown[];
    }>;
}

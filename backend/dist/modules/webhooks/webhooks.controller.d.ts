import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    receivePix(payload: Record<string, unknown>, signature?: string): Promise<{
        received: boolean;
    }>;
    receiveCard(payload: Record<string, unknown>, signature?: string): Promise<{
        received: boolean;
    }>;
    receiveWithdrawal(payload: Record<string, unknown>, signature?: string): Promise<{
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

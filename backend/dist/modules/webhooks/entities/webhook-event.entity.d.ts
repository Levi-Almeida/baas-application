export declare class WebhookEvent {
    id: string;
    event: string;
    externalReference?: string;
    gatewayEntityId?: string;
    payload: Record<string, unknown>;
    processedAt?: Date;
    createdAt: Date;
}

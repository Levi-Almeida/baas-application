export declare class RegisterWebhookDto {
    event: 'PAYMENT_PIX' | 'PAYMENT_CARD' | 'WITHDRAWAL';
    url: string;
    secret?: string;
}

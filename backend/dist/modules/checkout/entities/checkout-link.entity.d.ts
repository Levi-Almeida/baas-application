export declare class CheckoutLink {
    id: string;
    userId: string;
    paymentMethod: 'PIX' | 'CARD';
    amount: number;
    externalReference: string;
    status: string;
    gatewayPaymentId?: string;
    txid?: string;
    qrCodeBase64?: string;
    emv?: string;
    feePercent?: number;
    installments?: number;
    createdAt: Date;
    updatedAt: Date;
}

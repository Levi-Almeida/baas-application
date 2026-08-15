export interface LeraBoxWebhookPayload
  extends Record<string, unknown> {
  event: 'PAYMENT_PIX' | 'PAYMENT_CARD' | 'WITHDRAWAL';

  status: string;

  denialReason?: string | null;

  transactionId?: string;

  externalReference?: string;

  txid?: string;

  amount?: number;

  amountFormatted?: string;

  message?: string;

  CodigoCliente?: number;

  ChaveLoja?: string;

  metadata?: Record<string, unknown>;
}
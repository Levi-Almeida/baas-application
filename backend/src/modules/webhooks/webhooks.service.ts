import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import {
    createHmac,
    timingSafeEqual,
} from 'crypto';
import { CheckoutService } from '../checkout/checkout.service';
import { InjectRepository } from '@nestjs/typeorm';
import { WebhookEvent } from './entities/webhook-event.entity';
import { Repository } from 'typeorm';
import { LeraBoxWebhookPayload } from './interfaces/lera-box-webhook-payload.interface';

@Injectable()
export class WebhooksService {
    constructor(
        @InjectRepository(WebhookEvent)
        private readonly webhookEventRepository: Repository<WebhookEvent>,

        private readonly gatewayService: GatewayService,
        private readonly gatewayAccountsService: GatewayAccountsService,
        private readonly configService: ConfigService,
        private readonly checkoutService: CheckoutService,
    ) { }

    async configure(userId: string) {
        const gatewayAccount =
            await this.gatewayAccountsService.findByUserId(userId);

        if (!gatewayAccount) {
            throw new NotFoundException(
                'Conta do gateway não encontrada',
            );
        }

        const publicUrl =
            this.configService.get<string>('PUBLIC_API_URL');

        const secret =
            this.configService.get<string>('WEBHOOK_SECRET');

        if (!publicUrl || !secret) {
            throw new Error(
                'PUBLIC_API_URL ou WEBHOOK_SECRET não configurado',
            );
        }

        const webhooks = [
            {
                event: 'PAYMENT_PIX' as const,
                url: `${publicUrl}/api/webhooks/lera-box/pix`,
            },
            {
                event: 'PAYMENT_CARD' as const,
                url: `${publicUrl}/api/webhooks/lera-box/card`,
            },
            {
                event: 'WITHDRAWAL' as const,
                url: `${publicUrl}/api/webhooks/lera-box/withdrawal`,
            },
        ];

        const results: unknown[] = []; //implementar de acordo com lerabox

        for (const webhook of webhooks) {
            const result =
                await this.gatewayService.registerWebhook(
                    gatewayAccount.accessToken,
                    {
                        ...webhook,
                        secret,
                    },
                );

            results.push(result);
        }

        return {
            message: 'Webhooks configurados com sucesso',
            webhooks: results,
        };
    }


    private validateSignature(
        payload: Record<string, unknown>,
        signature?: string,
    ) {
        const secret =
            this.configService.get<string>('WEBHOOK_SECRET');

        if (!secret) {
            throw new Error(
                'WEBHOOK_SECRET não configurado',
            );
        }

        if (!signature) {
            return false;
        }

        const body = JSON.stringify(payload);

        const expectedSignature =
            createHmac('sha256', secret)
                .update(body)
                .digest('hex');

        const receivedBuffer =
            Buffer.from(signature);

        const expectedBuffer =
            Buffer.from(expectedSignature);

        if (
            receivedBuffer.length !==
            expectedBuffer.length
        ) {
            return false;
        }

        return timingSafeEqual(
            receivedBuffer,
            expectedBuffer,
        );
    }

    async process(
        event: 'PAYMENT_PIX' | 'PAYMENT_CARD' | 'WITHDRAWAL',
        payload: LeraBoxWebhookPayload,
        signature?: string,
    ) {
        const webhookEvent =
            this.webhookEventRepository.create({
                event,
                externalReference: payload.externalReference,
                gatewayEntityId: payload.transactionId,
                payload,
            });

        await this.webhookEventRepository.save(
            webhookEvent,
        );

        if (
            (event === 'PAYMENT_PIX' ||
                event === 'PAYMENT_CARD') &&
            payload.externalReference
        ) {
            await this.checkoutService
                .updateStatusByExternalReference(
                    payload.externalReference,
                    payload.status,
                );
        }

        webhookEvent.processedAt = new Date();

        await this.webhookEventRepository.save(
            webhookEvent,
        );

        return {
            received: true,
        };
    }
}
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
import { WithdrawalsService } from '../withdrawals/withdrawals.service';


import {
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class WebhooksService {
    constructor(
        @InjectRepository(WebhookEvent)
        private readonly webhookEventRepository: Repository<WebhookEvent>,

        private readonly gatewayService: GatewayService,
        private readonly gatewayAccountsService: GatewayAccountsService,
        private readonly configService: ConfigService,
        private readonly checkoutService: CheckoutService,
        private readonly withdrawalsService: WithdrawalsService,
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
        rawBody: Buffer,
        signature?: string,
    ): void {
        const secret =
            this.configService.get<string>('WEBHOOK_SECRET');

        if (!secret) {
            throw new Error(
                'WEBHOOK_SECRET não configurado',
            );
        }

        if (!signature) {
            throw new UnauthorizedException(
                'Assinatura do webhook não informada',
            );
        }

        const expectedSignature = createHmac(
            'sha256',
            secret,
        )
            .update(rawBody)
            .digest('hex');

        const receivedBuffer = Buffer.from(
            signature,
            'utf8',
        );

        const expectedBuffer = Buffer.from(
            expectedSignature,
            'utf8',
        );

        if (
            receivedBuffer.length !==
            expectedBuffer.length
        ) {
            throw new UnauthorizedException(
                'Assinatura do webhook inválida',
            );
        }

        const isValid = timingSafeEqual(
            receivedBuffer,
            expectedBuffer,
        );

        if (!isValid) {
            throw new UnauthorizedException(
                'Assinatura do webhook inválida',
            );
        }
    }

    async process(
        event:
            | 'PAYMENT_PIX'
            | 'PAYMENT_CARD'
            | 'WITHDRAWAL',
        payload: LeraBoxWebhookPayload,
        signature: string | undefined,
        rawBody: Buffer | undefined,
    ) {
        if (!rawBody) {
            throw new UnauthorizedException(
                'Raw body do webhook não disponível',
            );
        }

        this.validateSignature(
            rawBody,
            signature,
        );

        if (payload.transactionId) {
            const existingEvent =
                await this.webhookEventRepository.findOne({
                    where: {
                        gatewayEntityId:
                            payload.transactionId,
                    },
                });

            if (existingEvent) {
                return {
                    received: true,
                    duplicate: true,
                };
            }
        }

        const webhookEvent =
            this.webhookEventRepository.create({
                event,
                externalReference:
                    payload.externalReference,
                gatewayEntityId:
                    payload.transactionId,
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

        if (
            event === 'WITHDRAWAL' &&
            payload.externalReference
        ) {
            await this.withdrawalsService
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
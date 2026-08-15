import {
    Body,
    Controller,
    Headers,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import type {
    RawBodyRequest,
} from '@nestjs/common';

import {
    Request,
} from 'express';

import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as leraBoxWebhookPayloadInterface from './interfaces/lera-box-webhook-payload.interface';
import type { LeraBoxWebhookPayload } from './interfaces/lera-box-webhook-payload.interface';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
    constructor(
        private readonly webhooksService: WebhooksService,
    ) { }

    @Post('lera-box/pix')
    @ApiOperation({
        summary: 'Receber webhook de pagamento Pix',
    })
    receivePix(
        @Req()
        request: RawBodyRequest<Request>,
        @Body()
        payload: LeraBoxWebhookPayload,
        @Headers('x-lera-box-signature')
        signature?: string,
    ) {
        return this.webhooksService.process(
            'PAYMENT_PIX',
            payload,
            signature,
            request.rawBody,
        );
    }

    @Post('lera-box/card')
    @ApiOperation({
        summary: 'Receber webhook de pagamento com cartão',
    })
    receiveCard(
        @Req()
        request: RawBodyRequest<Request>,
        @Body()
        payload: LeraBoxWebhookPayload,
        @Headers('x-lera-box-signature')
        signature?: string,
    ) {
        return this.webhooksService.process(
            'PAYMENT_CARD',
            payload,
            signature,
            request.rawBody,
        );
    }

    @Post('lera-box/withdrawal')
    @ApiOperation({
        summary: 'Receber webhook de saque',
    })
    receiveWithdrawal(
        @Req()
        request: RawBodyRequest<Request>,
        @Body()
        payload: LeraBoxWebhookPayload,
        @Headers('x-lera-box-signature')
        signature?: string,
    ) {
        return this.webhooksService.process(
            'WITHDRAWAL',
            payload,
            signature,
            request.rawBody,
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('configure')
    @ApiOperation({
        summary: 'Configurar webhooks no gateway',
    })
    configure(
        @Req()
        request: {
            user: {
                userId: string;
            };
        },
    ) {
        return this.webhooksService.configure(
            request.user.userId,
        );
    }
}
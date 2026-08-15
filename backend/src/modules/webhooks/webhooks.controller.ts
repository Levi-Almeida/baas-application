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

import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as leraBoxWebhookPayloadInterface from './interfaces/lera-box-webhook-payload.interface';

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
        @Body() payload: leraBoxWebhookPayloadInterface.LeraBoxWebhookPayload,
        @Headers('x-lera-box-signature')
        signature?: string,
    ) {
        return this.webhooksService.process(
            'PAYMENT_PIX',
            payload,
            signature,
        );
    }

    @Post('lera-box/card')
    @ApiOperation({
        summary: 'Receber webhook de pagamento com cartão',
    })
    receiveCard(
        @Body() payload: leraBoxWebhookPayloadInterface.LeraBoxWebhookPayload,
        @Headers('x-lera-box-signature')
        signature?: string,
    ) {
        return this.webhooksService.process(
            'PAYMENT_CARD',
            payload,
            signature,
        );
    }

    @Post('lera-box/withdrawal')
    @ApiOperation({
        summary: 'Receber webhook de saque',
    })
    receiveWithdrawal(
        @Body() payload: leraBoxWebhookPayloadInterface.LeraBoxWebhookPayload,
        @Headers('x-lera-box-signature')
        signature?: string,
    ) {
        return this.webhooksService.process(
            'WITHDRAWAL',
            payload,
            signature,
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
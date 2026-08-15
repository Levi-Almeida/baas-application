"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const gateway_service_1 = require("../gateway/gateway.service");
const gateway_accounts_service_1 = require("../gateway-accounts/gateway-accounts.service");
const crypto_1 = require("crypto");
const checkout_service_1 = require("../checkout/checkout.service");
const typeorm_1 = require("@nestjs/typeorm");
const webhook_event_entity_1 = require("./entities/webhook-event.entity");
const typeorm_2 = require("typeorm");
let WebhooksService = class WebhooksService {
    webhookEventRepository;
    gatewayService;
    gatewayAccountsService;
    configService;
    checkoutService;
    constructor(webhookEventRepository, gatewayService, gatewayAccountsService, configService, checkoutService) {
        this.webhookEventRepository = webhookEventRepository;
        this.gatewayService = gatewayService;
        this.gatewayAccountsService = gatewayAccountsService;
        this.configService = configService;
        this.checkoutService = checkoutService;
    }
    async configure(userId) {
        const gatewayAccount = await this.gatewayAccountsService.findByUserId(userId);
        if (!gatewayAccount) {
            throw new common_1.NotFoundException('Conta do gateway não encontrada');
        }
        const publicUrl = this.configService.get('PUBLIC_API_URL');
        const secret = this.configService.get('WEBHOOK_SECRET');
        if (!publicUrl || !secret) {
            throw new Error('PUBLIC_API_URL ou WEBHOOK_SECRET não configurado');
        }
        const webhooks = [
            {
                event: 'PAYMENT_PIX',
                url: `${publicUrl}/api/webhooks/lera-box/pix`,
            },
            {
                event: 'PAYMENT_CARD',
                url: `${publicUrl}/api/webhooks/lera-box/card`,
            },
            {
                event: 'WITHDRAWAL',
                url: `${publicUrl}/api/webhooks/lera-box/withdrawal`,
            },
        ];
        const results = [];
        for (const webhook of webhooks) {
            const result = await this.gatewayService.registerWebhook(gatewayAccount.accessToken, {
                ...webhook,
                secret,
            });
            results.push(result);
        }
        return {
            message: 'Webhooks configurados com sucesso',
            webhooks: results,
        };
    }
    validateSignature(payload, signature) {
        const secret = this.configService.get('WEBHOOK_SECRET');
        if (!secret) {
            throw new Error('WEBHOOK_SECRET não configurado');
        }
        if (!signature) {
            return false;
        }
        const body = JSON.stringify(payload);
        const expectedSignature = (0, crypto_1.createHmac)('sha256', secret)
            .update(body)
            .digest('hex');
        const receivedBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);
        if (receivedBuffer.length !==
            expectedBuffer.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(receivedBuffer, expectedBuffer);
    }
    async process(event, payload, signature) {
        const webhookEvent = this.webhookEventRepository.create({
            event,
            externalReference: payload.externalReference,
            gatewayEntityId: payload.transactionId,
            payload,
        });
        await this.webhookEventRepository.save(webhookEvent);
        if ((event === 'PAYMENT_PIX' ||
            event === 'PAYMENT_CARD') &&
            payload.externalReference) {
            await this.checkoutService
                .updateStatusByExternalReference(payload.externalReference, payload.status);
        }
        webhookEvent.processedAt = new Date();
        await this.webhookEventRepository.save(webhookEvent);
        return {
            received: true,
        };
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(webhook_event_entity_1.WebhookEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gateway_service_1.GatewayService,
        gateway_accounts_service_1.GatewayAccountsService,
        config_1.ConfigService,
        checkout_service_1.CheckoutService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map
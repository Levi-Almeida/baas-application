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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const gateway_service_1 = require("../gateway/gateway.service");
const gateway_accounts_service_1 = require("../gateway-accounts/gateway-accounts.service");
const crypto_1 = require("crypto");
let WebhooksService = class WebhooksService {
    gatewayService;
    gatewayAccountsService;
    configService;
    constructor(gatewayService, gatewayAccountsService, configService) {
        this.gatewayService = gatewayService;
        this.gatewayAccountsService = gatewayAccountsService;
        this.configService = configService;
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
        console.log('WEBHOOK EVENT:', event);
        console.log('WEBHOOK PAYLOAD:', payload);
        console.log('WEBHOOK SIGNATURE:', signature);
        return {
            received: true,
        };
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService,
        gateway_accounts_service_1.GatewayAccountsService,
        config_1.ConfigService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map
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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("./webhooks.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WebhooksController = class WebhooksController {
    webhooksService;
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    receivePix(payload, signature) {
        return this.webhooksService.process('PAYMENT_PIX', payload, signature);
    }
    receiveCard(payload, signature) {
        return this.webhooksService.process('PAYMENT_CARD', payload, signature);
    }
    receiveWithdrawal(payload, signature) {
        return this.webhooksService.process('WITHDRAWAL', payload, signature);
    }
    configure(request) {
        return this.webhooksService.configure(request.user.userId);
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('lera-box/pix'),
    (0, swagger_1.ApiOperation)({
        summary: 'Receber webhook de pagamento Pix',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-lera-box-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "receivePix", null);
__decorate([
    (0, common_1.Post)('lera-box/card'),
    (0, swagger_1.ApiOperation)({
        summary: 'Receber webhook de pagamento com cartão',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-lera-box-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "receiveCard", null);
__decorate([
    (0, common_1.Post)('lera-box/withdrawal'),
    (0, swagger_1.ApiOperation)({
        summary: 'Receber webhook de saque',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-lera-box-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "receiveWithdrawal", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('configure'),
    (0, swagger_1.ApiOperation)({
        summary: 'Configurar webhooks no gateway',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "configure", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map
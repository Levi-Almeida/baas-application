"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const leraBoxWebhookPayloadInterface = __importStar(require("./interfaces/lera-box-webhook-payload.interface"));
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
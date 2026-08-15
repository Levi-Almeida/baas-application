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
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const gateway_service_1 = require("../gateway/gateway.service");
const gateway_accounts_service_1 = require("../gateway-accounts/gateway-accounts.service");
const checkout_link_entity_1 = require("./entities/checkout-link.entity");
let CheckoutService = class CheckoutService {
    checkoutRepository;
    gatewayService;
    gatewayAccountsService;
    constructor(checkoutRepository, gatewayService, gatewayAccountsService) {
        this.checkoutRepository = checkoutRepository;
        this.gatewayService = gatewayService;
        this.gatewayAccountsService = gatewayAccountsService;
    }
    async createPixCheckout(userId, dto) {
        const gatewayAccount = await this.gatewayAccountsService.findByUserId(userId);
        if (!gatewayAccount) {
            throw new common_1.NotFoundException('Conta do gateway não encontrada');
        }
        const externalReference = `CHECKOUT-${(0, crypto_1.randomUUID)()}`;
        const checkout = this.checkoutRepository.create({
            userId,
            paymentMethod: 'PIX',
            amount: dto.amount,
            externalReference,
            status: 'PENDING',
        });
        const savedCheckout = await this.checkoutRepository.save(checkout);
        const gatewayResponse = await this.gatewayService.createPixPayment(gatewayAccount.accessToken, {
            amount: dto.amount,
            description: dto.description,
            payerDocument: dto.payerDocument,
            externalReference,
        });
        savedCheckout.gatewayPaymentId =
            gatewayResponse.id;
        savedCheckout.txid =
            gatewayResponse.txid;
        savedCheckout.qrCodeBase64 =
            gatewayResponse.qrCodeBase64;
        savedCheckout.emv =
            gatewayResponse.emv;
        if (gatewayResponse.status) {
            savedCheckout.status =
                gatewayResponse.status;
        }
        await this.checkoutRepository.save(savedCheckout);
        return {
            checkoutId: savedCheckout.id,
            externalReference: savedCheckout.externalReference,
            status: savedCheckout.status,
            qrCodeBase64: savedCheckout.qrCodeBase64,
            emv: savedCheckout.emv,
            txid: savedCheckout.txid,
        };
    }
    async createCardCheckout(userId, dto) {
        const gatewayAccount = await this.gatewayAccountsService.findByUserId(userId);
        if (!gatewayAccount) {
            throw new common_1.NotFoundException('Conta do gateway não encontrada');
        }
        const feesResponse = await this.gatewayService.getFees(dto.brand);
        const selectedFee = feesResponse.fees.find((fee) => fee.installments === dto.installments);
        if (!selectedFee) {
            throw new common_1.BadRequestException('Taxa não encontrada para a quantidade de parcelas informada');
        }
        const externalReference = `CHECKOUT-${(0, crypto_1.randomUUID)()}`;
        const checkout = this.checkoutRepository.create({
            userId,
            paymentMethod: 'CARD',
            amount: dto.amount,
            externalReference,
            status: 'PENDING',
            installments: dto.installments,
            feePercent: selectedFee.feePercent,
        });
        const savedCheckout = await this.checkoutRepository.save(checkout);
        const gatewayResponse = await this.gatewayService.createCardPayment(gatewayAccount.accessToken, {
            amount: dto.amount,
            description: dto.description,
            externalReference,
            cardNumber: dto.cardNumber,
            cardHolder: dto.cardHolder,
            expiryMonth: dto.expiryMonth,
            expiryYear: dto.expiryYear,
            cvv: dto.cvv,
            installments: dto.installments,
            feePercent: selectedFee.feePercent,
        });
        savedCheckout.gatewayPaymentId =
            gatewayResponse.id;
        if (gatewayResponse.status) {
            savedCheckout.status =
                gatewayResponse.status;
        }
        await this.checkoutRepository.save(savedCheckout);
        return {
            checkoutId: savedCheckout.id,
            externalReference: savedCheckout.externalReference,
            status: savedCheckout.status,
            installments: savedCheckout.installments,
            feePercent: Number(savedCheckout.feePercent),
        };
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(checkout_link_entity_1.CheckoutLink)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gateway_service_1.GatewayService,
        gateway_accounts_service_1.GatewayAccountsService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map
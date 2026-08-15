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
exports.CheckoutLink = void 0;
const typeorm_1 = require("typeorm");
let CheckoutLink = class CheckoutLink {
    id;
    userId;
    paymentMethod;
    amount;
    externalReference;
    status;
    gatewayPaymentId;
    txid;
    qrCodeBase64;
    emv;
    feePercent;
    installments;
    createdAt;
    updatedAt;
};
exports.CheckoutLink = CheckoutLink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CheckoutLink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['PIX', 'CARD'],
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        comment: 'Valor em centavos',
    }),
    __metadata("design:type", Number)
], CheckoutLink.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'external_reference',
        unique: true,
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "externalReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: [
            'PENDING',
            'APPROVED',
            'DENIED',
            'EXPIRED',
            'CANCELLED',
        ],
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gateway_payment_id',
        nullable: true,
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "gatewayPaymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'txid',
        nullable: true,
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "txid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'qr_code_base64',
        type: 'longtext',
        nullable: true,
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "qrCodeBase64", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], CheckoutLink.prototype, "emv", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fee_percent',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], CheckoutLink.prototype, "feePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Number)
], CheckoutLink.prototype, "installments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], CheckoutLink.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], CheckoutLink.prototype, "updatedAt", void 0);
exports.CheckoutLink = CheckoutLink = __decorate([
    (0, typeorm_1.Entity)('checkout_links')
], CheckoutLink);
//# sourceMappingURL=checkout-link.entity.js.map
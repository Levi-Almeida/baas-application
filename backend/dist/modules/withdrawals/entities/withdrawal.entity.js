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
exports.Withdrawal = void 0;
const typeorm_1 = require("typeorm");
let Withdrawal = class Withdrawal {
    id;
    userId;
    amount;
    pixKey;
    document;
    description;
    externalReference;
    gatewayWithdrawalId;
    status;
    createdAt;
    updatedAt;
};
exports.Withdrawal = Withdrawal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Withdrawal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Withdrawal.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        comment: 'Valor em centavos',
    }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pix_key' }),
    __metadata("design:type", String)
], Withdrawal.prototype, "pixKey", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Withdrawal.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Withdrawal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'external_reference',
        unique: true,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "externalReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gateway_withdrawal_id',
        nullable: true,
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "gatewayWithdrawalId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], Withdrawal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "updatedAt", void 0);
exports.Withdrawal = Withdrawal = __decorate([
    (0, typeorm_1.Entity)('withdrawals')
], Withdrawal);
//# sourceMappingURL=withdrawal.entity.js.map
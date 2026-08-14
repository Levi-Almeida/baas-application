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
exports.GatewayAccount = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let GatewayAccount = class GatewayAccount {
    id;
    userId;
    user;
    gatewayUserId;
    codigoCliente;
    chaveLoja;
    accessToken;
    tokenType;
    createdAt;
    updatedAt;
};
exports.GatewayAccount = GatewayAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GatewayAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_id',
        unique: true,
    }),
    __metadata("design:type", String)
], GatewayAccount.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.gatewayAccount, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], GatewayAccount.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gateway_user_id',
    }),
    __metadata("design:type", String)
], GatewayAccount.prototype, "gatewayUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'codigo_cliente',
    }),
    __metadata("design:type", Number)
], GatewayAccount.prototype, "codigoCliente", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'chave_loja',
    }),
    __metadata("design:type", String)
], GatewayAccount.prototype, "chaveLoja", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'access_token',
        type: 'text',
    }),
    __metadata("design:type", String)
], GatewayAccount.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'token_type',
        default: 'Bearer',
    }),
    __metadata("design:type", String)
], GatewayAccount.prototype, "tokenType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GatewayAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GatewayAccount.prototype, "updatedAt", void 0);
exports.GatewayAccount = GatewayAccount = __decorate([
    (0, typeorm_1.Entity)('gateway_accounts')
], GatewayAccount);
//# sourceMappingURL=gateway-account.entity.js.map
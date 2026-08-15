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
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const gateway_service_1 = require("../gateway/gateway.service");
const gateway_accounts_service_1 = require("../gateway-accounts/gateway-accounts.service");
const withdrawal_entity_1 = require("./entities/withdrawal.entity");
let WithdrawalsService = class WithdrawalsService {
    withdrawalRepository;
    gatewayService;
    gatewayAccountsService;
    constructor(withdrawalRepository, gatewayService, gatewayAccountsService) {
        this.withdrawalRepository = withdrawalRepository;
        this.gatewayService = gatewayService;
        this.gatewayAccountsService = gatewayAccountsService;
    }
    async create(userId, dto) {
        const gatewayAccount = await this.gatewayAccountsService.findByUserId(userId);
        if (!gatewayAccount) {
            throw new common_1.NotFoundException('Conta do gateway não encontrada');
        }
        const externalReference = `WITHDRAWAL-${(0, crypto_1.randomUUID)()}`;
        const withdrawal = this.withdrawalRepository.create({
            userId,
            amount: dto.amount,
            pixKey: dto.pixKey,
            description: dto.description,
            document: dto.document,
            externalReference,
            status: 'PENDING',
        });
        const savedWithdrawal = await this.withdrawalRepository.save(withdrawal);
        const gatewayResponse = await this.gatewayService.createWithdrawal(gatewayAccount.accessToken, {
            amount: dto.amount,
            pixKey: dto.pixKey,
            description: dto.description,
            document: dto.document,
            externalReference,
        });
        savedWithdrawal.gatewayWithdrawalId =
            gatewayResponse.id;
        if (gatewayResponse.status) {
            savedWithdrawal.status =
                gatewayResponse.status;
        }
        await this.withdrawalRepository.save(savedWithdrawal);
        return {
            id: savedWithdrawal.id,
            gatewayWithdrawalId: savedWithdrawal.gatewayWithdrawalId,
            externalReference: savedWithdrawal.externalReference,
            status: savedWithdrawal.status,
            amount: savedWithdrawal.amount,
        };
    }
    async findOne(userId, withdrawalId) {
        const gatewayAccount = await this.gatewayAccountsService.findByUserId(userId);
        if (!gatewayAccount) {
            throw new common_1.NotFoundException('Conta do gateway não encontrada');
        }
        const withdrawal = await this.withdrawalRepository.findOne({
            where: {
                id: withdrawalId,
                userId,
            },
        });
        if (!withdrawal) {
            throw new common_1.NotFoundException('Saque não encontrado');
        }
        if (!withdrawal.gatewayWithdrawalId) {
            return withdrawal;
        }
        const gatewayResponse = await this.gatewayService.getWithdrawal(gatewayAccount.accessToken, withdrawal.gatewayWithdrawalId);
        if (gatewayResponse.status) {
            withdrawal.status =
                gatewayResponse.status;
            await this.withdrawalRepository.save(withdrawal);
        }
        return {
            id: withdrawal.id,
            externalReference: withdrawal.externalReference,
            status: withdrawal.status,
            amount: withdrawal.amount,
            gateway: gatewayResponse,
        };
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.Withdrawal)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gateway_service_1.GatewayService,
        gateway_accounts_service_1.GatewayAccountsService])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map
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
exports.GatewayService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let GatewayService = class GatewayService {
    httpService;
    configService;
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl =
            this.configService.get('GATEWAY_BASE_URL') ?? '';
    }
    async registerUser(data) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/users`, data));
            return response.data;
        }
        catch (error) {
            const axiosError = error;
            const status = axiosError.response?.status;
            const message = axiosError.response?.data?.message ??
                'Erro ao realizar cadastro no gateway';
            if (status === 409) {
                throw new common_1.ConflictException(message);
            }
            if (status) {
                throw new common_1.HttpException(message, status);
            }
            throw new common_1.BadGatewayException('Não foi possível comunicar com o gateway');
        }
    }
    async login(document, password) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/auth/login`, {
                document,
                password,
            }));
            return response.data;
        }
        catch (error) {
            const axiosError = error;
            const status = axiosError.response?.status;
            const message = axiosError.response?.data?.message ??
                'Erro ao realizar login no gateway';
            if (status === 409) {
                throw new common_1.ConflictException(message);
            }
            if (status) {
                throw new common_1.HttpException(message, status);
            }
            throw new common_1.BadGatewayException('Não foi possível comunicar com o gateway');
        }
    }
    async getWallet(accessToken) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/wallet`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }));
        return response.data;
    }
    async getWalletTransactions(accessToken, filters) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/wallet/transactions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: filters,
        }));
        return response.data;
    }
    async getFees(brand) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/fees`, {
            params: brand
                ? { brand }
                : undefined,
        }));
        return response.data;
    }
    async createPixPayment(accessToken, data) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/payments/pix`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }));
        return response.data;
    }
};
exports.GatewayService = GatewayService;
exports.GatewayService = GatewayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], GatewayService);
//# sourceMappingURL=gateway.service.js.map
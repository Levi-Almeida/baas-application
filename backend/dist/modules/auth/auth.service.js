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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const gateway_service_1 = require("../gateway/gateway.service");
const users_service_1 = require("../users/users.service");
const gateway_accounts_service_1 = require("../gateway-accounts/gateway-accounts.service");
let AuthService = class AuthService {
    gatewayService;
    usersService;
    gatewayAccountsService;
    constructor(gatewayService, usersService, gatewayAccountsService) {
        this.gatewayService = gatewayService;
        this.usersService = usersService;
        this.gatewayAccountsService = gatewayAccountsService;
    }
    async register(data) {
        const gatewayResponse = await this.gatewayService.registerUser(data);
        return {
            message: 'Cadastro realizado com sucesso. Verifique seu e-mail para obter as credenciais de acesso.',
            gateway: gatewayResponse,
        };
    }
    async login(data) {
        const gatewayResponse = await this.gatewayService.login(data.document, data.password);
        const gatewayUser = gatewayResponse.user;
        let user = await this.usersService.findByDocument(gatewayUser.document);
        if (!user) {
            user = await this.usersService.create({
                name: gatewayUser.name,
                email: gatewayUser.email,
                document: gatewayUser.document,
                personType: gatewayUser.personType,
                tradingName: gatewayUser.tradingName,
            });
        }
        const existingGatewayAccount = await this.gatewayAccountsService.findByUserId(user.id);
        if (!existingGatewayAccount) {
            await this.gatewayAccountsService.create({
                userId: user.id,
                gatewayUserId: gatewayUser.id,
                codigoCliente: gatewayResponse.codigoCliente,
                chaveLoja: gatewayResponse.chaveLoja,
                accessToken: gatewayResponse.access_token,
                tokenType: gatewayResponse.token_type,
            });
        }
        else {
            await this.gatewayAccountsService.updateToken(existingGatewayAccount.id, gatewayResponse.access_token, gatewayResponse.token_type);
        }
        return {
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                document: user.document,
                personType: user.personType,
                tradingName: user.tradingName,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService,
        users_service_1.UsersService,
        gateway_accounts_service_1.GatewayAccountsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
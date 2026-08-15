"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const gateway_module_1 = require("../gateway/gateway.module");
const gateway_accounts_module_1 = require("../gateway-accounts/gateway-accounts.module");
const checkout_controller_1 = require("./checkout.controller");
const checkout_service_1 = require("./checkout.service");
const checkout_link_entity_1 = require("./entities/checkout-link.entity");
let CheckoutModule = class CheckoutModule {
};
exports.CheckoutModule = CheckoutModule;
exports.CheckoutModule = CheckoutModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([checkout_link_entity_1.CheckoutLink]),
            auth_module_1.AuthModule,
            gateway_module_1.GatewayModule,
            gateway_accounts_module_1.GatewayAccountsModule,
        ],
        controllers: [checkout_controller_1.CheckoutController],
        providers: [checkout_service_1.CheckoutService],
    })
], CheckoutModule);
//# sourceMappingURL=checkout.module.js.map
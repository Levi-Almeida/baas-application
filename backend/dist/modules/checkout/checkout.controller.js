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
exports.CheckoutController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const checkout_service_1 = require("./checkout.service");
const create_pix_checkout_dto_1 = require("./dtos/create-pix-checkout.dto");
let CheckoutController = class CheckoutController {
    checkoutService;
    constructor(checkoutService) {
        this.checkoutService = checkoutService;
    }
    createPix(request, dto) {
        return this.checkoutService.createPixCheckout(request.user.userId, dto);
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('pix'),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar checkout Pix',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pix_checkout_dto_1.CreatePixCheckoutDto]),
    __metadata("design:returntype", void 0)
], CheckoutController.prototype, "createPix", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Checkout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('checkouts'),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map
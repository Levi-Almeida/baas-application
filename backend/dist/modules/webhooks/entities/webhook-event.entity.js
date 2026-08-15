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
exports.WebhookEvent = void 0;
const typeorm_1 = require("typeorm");
let WebhookEvent = class WebhookEvent {
    id;
    event;
    externalReference;
    gatewayEntityId;
    payload;
    processedAt;
    createdAt;
};
exports.WebhookEvent = WebhookEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WebhookEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WebhookEvent.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'external_reference',
        nullable: true,
    }),
    __metadata("design:type", String)
], WebhookEvent.prototype, "externalReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gateway_entity_id',
        nullable: true,
    }),
    __metadata("design:type", String)
], WebhookEvent.prototype, "gatewayEntityId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
    }),
    __metadata("design:type", Object)
], WebhookEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'processed_at',
        type: 'datetime',
        nullable: true,
    }),
    __metadata("design:type", Date)
], WebhookEvent.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], WebhookEvent.prototype, "createdAt", void 0);
exports.WebhookEvent = WebhookEvent = __decorate([
    (0, typeorm_1.Entity)('webhook_events')
], WebhookEvent);
//# sourceMappingURL=webhook-event.entity.js.map
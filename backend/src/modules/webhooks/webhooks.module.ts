import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { GatewayModule } from '../gateway/gateway.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';

import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { CheckoutModule } from '../checkout/checkout.module';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEvent]),
    AuthModule,
    GatewayModule,
    GatewayAccountsModule,
    CheckoutModule,
    WithdrawalsModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule { }
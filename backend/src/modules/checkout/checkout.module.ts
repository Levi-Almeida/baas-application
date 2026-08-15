import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { GatewayModule } from '../gateway/gateway.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';

import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutLink } from './entities/checkout-link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckoutLink]),
    AuthModule,
    GatewayModule,
    GatewayAccountsModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { GatewayModule } from '../gateway/gateway.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    AuthModule,
    GatewayModule,
    GatewayAccountsModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
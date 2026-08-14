import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GatewayAccount } from './entities/gateway-account.entity';
import { GatewayAccountsService } from './gateway-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([GatewayAccount])],
  providers: [GatewayAccountsService],
  exports: [GatewayAccountsService],
})
export class GatewayAccountsModule {}
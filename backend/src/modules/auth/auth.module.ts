import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';

@Module({
  imports: [GatewayModule, UsersModule, GatewayAccountsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
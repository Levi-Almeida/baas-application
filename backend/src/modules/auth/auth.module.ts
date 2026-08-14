import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [GatewayModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
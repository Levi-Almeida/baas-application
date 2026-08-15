import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { GatewayModule } from '../gateway/gateway.module';
import { UsersModule } from '../users/users.module';
import { GatewayAccountsModule } from '../gateway-accounts/gateway-accounts.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import type { StringValue } from 'ms';

@Module({
  imports: [
    GatewayModule,
    UsersModule,
    GatewayAccountsModule,

    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            (configService.get<string>('JWT_EXPIRES_IN') ??
              '8h') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
  ],
})
export class AuthModule { }
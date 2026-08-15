import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { GatewayAccountsModule } from './modules/gateway-accounts/gateway-accounts.module';

import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { WalletModule } from './modules/wallet/wallet.module';
import { FeesModule } from './modules/fees/fees.module';
import { CheckoutModule } from './modules/checkout/checkout.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    HealthModule,
    GatewayModule,
    AuthModule,

    UsersModule,
    GatewayAccountsModule,
    WalletModule,
    FeesModule,
    CheckoutModule,
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule { }
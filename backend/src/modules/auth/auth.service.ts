import { Injectable } from '@nestjs/common';

import { GatewayService } from '../gateway/gateway.service';
import { UsersService } from '../users/users.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';

import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly usersService: UsersService,
    private readonly gatewayAccountsService: GatewayAccountsService,
  ) {}

  async register(data: RegisterDto) {
    const gatewayResponse =
      await this.gatewayService.registerUser(data);

    return {
      message:
        'Cadastro realizado com sucesso. Verifique seu e-mail para obter as credenciais de acesso.',
      gateway: gatewayResponse,
    };
  }

  async login(data: LoginDto) {
    const gatewayResponse =
      await this.gatewayService.login(
        data.document,
        data.password,
      );

    const gatewayUser = gatewayResponse.user;

    let user =
      await this.usersService.findByDocument(
        gatewayUser.document,
      );

    if (!user) {
      user = await this.usersService.create({
        name: gatewayUser.name,
        email: gatewayUser.email,
        document: gatewayUser.document,
        personType: gatewayUser.personType,
        tradingName: gatewayUser.tradingName,
      });
    }

    const existingGatewayAccount =
      await this.gatewayAccountsService.findByUserId(
        user.id,
      );

    if (!existingGatewayAccount) {
      await this.gatewayAccountsService.create({
        userId: user.id,
        gatewayUserId: gatewayUser.id,
        codigoCliente:
          gatewayResponse.codigoCliente,
        chaveLoja:
          gatewayResponse.chaveLoja,
        accessToken:
          gatewayResponse.access_token,
        tokenType:
          gatewayResponse.token_type,
      });
    } else {
      await this.gatewayAccountsService.updateToken(
        existingGatewayAccount.id,
        gatewayResponse.access_token,
        gatewayResponse.token_type,
      );
    }

    return {
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        personType: user.personType,
        tradingName: user.tradingName,
      },
    };
  }
}
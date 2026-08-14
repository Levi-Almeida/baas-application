import { Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly gatewayService: GatewayService,
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
    return this.gatewayService.login(
        data.document,
        data.password,
    );
}
}
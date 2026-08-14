import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GatewayAccount } from './entities/gateway-account.entity';

@Injectable()
export class GatewayAccountsService {
  constructor(
    @InjectRepository(GatewayAccount)
    private readonly repository: Repository<GatewayAccount>,
  ) {}

  async findByUserId(userId: string) {
    return this.repository.findOne({
      where: { userId },
    });
  }

  async create(data: {
    userId: string;
    gatewayUserId: string;
    codigoCliente: number;
    chaveLoja: string;
    accessToken: string;
    tokenType: string;
  }) {
    const account = this.repository.create(data);
    return this.repository.save(account);
  }

  async updateToken(
    id: string,
    accessToken: string,
    tokenType: string,
  ) {
    await this.repository.update(id, {
      accessToken,
      tokenType,
    });
  }
}
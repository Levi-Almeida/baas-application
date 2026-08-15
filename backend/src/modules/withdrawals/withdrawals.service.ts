import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';

import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { Withdrawal } from './entities/withdrawal.entity';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,

    private readonly gatewayService: GatewayService,
    private readonly gatewayAccountsService: GatewayAccountsService,
  ) {}

  async create(
    userId: string,
    dto: CreateWithdrawalDto,
  ) {
    const gatewayAccount =
      await this.gatewayAccountsService.findByUserId(userId);

    if (!gatewayAccount) {
      throw new NotFoundException(
        'Conta do gateway não encontrada',
      );
    }

    const externalReference =
      `WITHDRAWAL-${randomUUID()}`;

    const withdrawal =
      this.withdrawalRepository.create({
        userId,
        amount: dto.amount,
        pixKey: dto.pixKey,
        description: dto.description,
        document: dto.document,
        externalReference,
        status: 'PENDING',
      });

    const savedWithdrawal =
      await this.withdrawalRepository.save(withdrawal);

    const gatewayResponse =
      await this.gatewayService.createWithdrawal(
        gatewayAccount.accessToken,
        {
          amount: dto.amount,
          pixKey: dto.pixKey,
          description: dto.description,
          document: dto.document,
          externalReference,
        },
      );

    savedWithdrawal.gatewayWithdrawalId =
      gatewayResponse.id;

    if (gatewayResponse.status) {
      savedWithdrawal.status =
        gatewayResponse.status;
    }

    await this.withdrawalRepository.save(
      savedWithdrawal,
    );

    return {
      id: savedWithdrawal.id,
      gatewayWithdrawalId:
        savedWithdrawal.gatewayWithdrawalId,
      externalReference:
        savedWithdrawal.externalReference,
      status: savedWithdrawal.status,
      amount: savedWithdrawal.amount,
    };
  }

  async findOne(
    userId: string,
    withdrawalId: string,
  ) {
    const gatewayAccount =
      await this.gatewayAccountsService.findByUserId(userId);

    if (!gatewayAccount) {
      throw new NotFoundException(
        'Conta do gateway não encontrada',
      );
    }

    const withdrawal =
      await this.withdrawalRepository.findOne({
        where: {
          id: withdrawalId,
          userId,
        },
      });

    if (!withdrawal) {
      throw new NotFoundException(
        'Saque não encontrado',
      );
    }

    if (!withdrawal.gatewayWithdrawalId) {
      return withdrawal;
    }

    const gatewayResponse =
      await this.gatewayService.getWithdrawal(
        gatewayAccount.accessToken,
        withdrawal.gatewayWithdrawalId,
      );

    if (gatewayResponse.status) {
      withdrawal.status =
        gatewayResponse.status;

      await this.withdrawalRepository.save(
        withdrawal,
      );
    }

    return {
      id: withdrawal.id,
      externalReference:
        withdrawal.externalReference,
      status: withdrawal.status,
      amount: withdrawal.amount,
      gateway: gatewayResponse,
    };
  }
}
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';

import { CheckoutLink } from './entities/checkout-link.entity';
import { CreatePixCheckoutDto } from './dtos/create-pix-checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(CheckoutLink)
    private readonly checkoutRepository: Repository<CheckoutLink>,

    private readonly gatewayService: GatewayService,
    private readonly gatewayAccountsService: GatewayAccountsService,
  ) {}

  async createPixCheckout(
    userId: string,
    dto: CreatePixCheckoutDto,
  ) {
    const gatewayAccount =
      await this.gatewayAccountsService.findByUserId(userId);

    if (!gatewayAccount) {
      throw new NotFoundException(
        'Conta do gateway não encontrada',
      );
    }

    const externalReference = `CHECKOUT-${randomUUID()}`;

    const checkout = this.checkoutRepository.create({
      userId,
      paymentMethod: 'PIX',
      amount: dto.amount,
      externalReference,
      status: 'PENDING',
    });

    const savedCheckout =
      await this.checkoutRepository.save(checkout);

    const gatewayResponse =
      await this.gatewayService.createPixPayment(
        gatewayAccount.accessToken,
        {
          amount: dto.amount,
          description: dto.description,
          payerDocument: dto.payerDocument,
          externalReference,
        },
      );

    savedCheckout.gatewayPaymentId =
      gatewayResponse.id;

    savedCheckout.txid =
      gatewayResponse.txid;

    savedCheckout.qrCodeBase64 =
      gatewayResponse.qrCodeBase64;

    savedCheckout.emv =
      gatewayResponse.emv;

    if (gatewayResponse.status) {
      savedCheckout.status =
        gatewayResponse.status;
    }

    await this.checkoutRepository.save(
      savedCheckout,
    );

    return {
      checkoutId: savedCheckout.id,
      externalReference:
        savedCheckout.externalReference,
      status: savedCheckout.status,
      qrCodeBase64:
        savedCheckout.qrCodeBase64,
      emv: savedCheckout.emv,
      txid: savedCheckout.txid,
    };
  }
}
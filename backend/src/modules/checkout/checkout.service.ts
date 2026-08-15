import {
    BadRequestException,
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
import { CreateCardCheckoutDto } from './dtos/create-card-checkout.dto';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(CheckoutLink)
        private readonly checkoutRepository: Repository<CheckoutLink>,

        private readonly gatewayService: GatewayService,
        private readonly gatewayAccountsService: GatewayAccountsService,
    ) { }

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

    async createCardCheckout(
        userId: string,
        dto: CreateCardCheckoutDto,
    ) {
        const gatewayAccount =
            await this.gatewayAccountsService.findByUserId(userId);

        if (!gatewayAccount) {
            throw new NotFoundException(
                'Conta do gateway não encontrada',
            );
        }

        const feesResponse =
            await this.gatewayService.getFees(dto.brand);

        const selectedFee = feesResponse.fees.find(
            (fee: {
                installments: number;
                feePercent: number;
            }) => fee.installments === dto.installments,
        );

        if (!selectedFee) {
            throw new BadRequestException(
                'Taxa não encontrada para a quantidade de parcelas informada',
            );
        }

        const externalReference =
            `CHECKOUT-${randomUUID()}`;

        const checkout =
            this.checkoutRepository.create({
                userId,
                paymentMethod: 'CARD',
                amount: dto.amount,
                externalReference,
                status: 'PENDING',
                installments: dto.installments,
                feePercent: selectedFee.feePercent,
            });

        const savedCheckout =
            await this.checkoutRepository.save(checkout);

        const gatewayResponse =
            await this.gatewayService.createCardPayment(
                gatewayAccount.accessToken,
                {
                    amount: dto.amount,
                    description: dto.description,
                    externalReference,
                    cardNumber: dto.cardNumber,
                    cardHolder: dto.cardHolder,
                    expiryMonth: dto.expiryMonth,
                    expiryYear: dto.expiryYear,
                    cvv: dto.cvv,
                    installments: dto.installments,
                    feePercent: selectedFee.feePercent,
                },
            );

        savedCheckout.gatewayPaymentId =
            gatewayResponse.id;

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
            installments:
                savedCheckout.installments,
            feePercent:
                Number(savedCheckout.feePercent),
        };
    }

    async updateStatusByExternalReference(
        externalReference: string,
        status: string,
    ) {
        const checkout = await this.checkoutRepository.findOne({
            where: { externalReference },
        });

        if (!checkout) {
            throw new NotFoundException(
                'Checkout não encontrado para a referência informada',
            );
        }

        checkout.status = status;

        return this.checkoutRepository.save(checkout);
    }
}
import { Repository } from 'typeorm';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { CheckoutLink } from './entities/checkout-link.entity';
import { CreatePixCheckoutDto } from './dtos/create-pix-checkout.dto';
import { CreateCardCheckoutDto } from './dtos/create-card-checkout.dto';
export declare class CheckoutService {
    private readonly checkoutRepository;
    private readonly gatewayService;
    private readonly gatewayAccountsService;
    constructor(checkoutRepository: Repository<CheckoutLink>, gatewayService: GatewayService, gatewayAccountsService: GatewayAccountsService);
    createPixCheckout(userId: string, dto: CreatePixCheckoutDto): Promise<{
        checkoutId: string;
        externalReference: string;
        status: string;
        qrCodeBase64: string | undefined;
        emv: string | undefined;
        txid: string | undefined;
    }>;
    createCardCheckout(userId: string, dto: CreateCardCheckoutDto): Promise<{
        checkoutId: string;
        externalReference: string;
        status: string;
        installments: number | undefined;
        feePercent: number;
    }>;
}

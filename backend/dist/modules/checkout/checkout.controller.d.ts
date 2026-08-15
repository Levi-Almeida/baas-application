import { CheckoutService } from './checkout.service';
import { CreatePixCheckoutDto } from './dtos/create-pix-checkout.dto';
import { CreateCardCheckoutDto } from './dtos/create-card-checkout.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    createPix(request: {
        user: {
            userId: string;
            email: string;
        };
    }, dto: CreatePixCheckoutDto): Promise<{
        checkoutId: string;
        externalReference: string;
        status: string;
        qrCodeBase64: string | undefined;
        emv: string | undefined;
        txid: string | undefined;
    }>;
    createCard(request: {
        user: {
            userId: string;
            email: string;
        };
    }, dto: CreateCardCheckoutDto): Promise<{
        checkoutId: string;
        externalReference: string;
        status: string;
        installments: number | undefined;
        feePercent: number;
    }>;
}

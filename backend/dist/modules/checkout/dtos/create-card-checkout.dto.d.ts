export declare class CreateCardCheckoutDto {
    amount: number;
    description: string;
    brand: 'VISA' | 'MASTERCARD' | 'ELO';
    cardNumber: string;
    cardHolder: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    installments: number;
}

import { FeesService } from './fees.service';
export declare class FeesController {
    private readonly feesService;
    constructor(feesService: FeesService);
    getFees(brand?: 'VISA' | 'MASTERCARD' | 'ELO'): Promise<any>;
}

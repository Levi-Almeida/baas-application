import { GatewayService } from '../gateway/gateway.service';
export declare class FeesService {
    private readonly gatewayService;
    constructor(gatewayService: GatewayService);
    getFees(brand?: 'VISA' | 'MASTERCARD' | 'ELO'): Promise<any>;
}

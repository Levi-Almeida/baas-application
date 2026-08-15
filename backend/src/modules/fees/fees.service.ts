import { Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class FeesService {
  constructor(
    private readonly gatewayService: GatewayService,
  ) {}

  getFees(
    brand?: 'VISA' | 'MASTERCARD' | 'ELO',
  ) {
    return this.gatewayService.getFees(brand);
  }
}
import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { FeesService } from './fees.service';

@ApiTags('Fees')
@Controller('fees')
export class FeesController {
  constructor(
    private readonly feesService: FeesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Consultar taxas de cartão',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    enum: ['VISA', 'MASTERCARD', 'ELO'],
  })
  getFees(
    @Query('brand')
    brand?: 'VISA' | 'MASTERCARD' | 'ELO',
  ) {
    return this.feesService.getFees(brand);
  }
}
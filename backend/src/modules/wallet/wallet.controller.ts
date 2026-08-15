import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Consultar saldo da carteira',
  })
  getWallet(
    @Req()
    request: {
      user: {
        userId: string;
        email: string;
      };
    },
  ) {
    return this.walletService.getWallet(
      request.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  @ApiOperation({
    summary: 'Consultar extrato da carteira',
  })
  getTransactions(
    @Req()
    request: {
      user: {
        userId: string;
        email: string;
      };
    },
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletService.getTransactions(
      request.user.userId,
      {
        status,
        type,
        limit: limit ? Number(limit) : undefined,
      },
    );
  }
}
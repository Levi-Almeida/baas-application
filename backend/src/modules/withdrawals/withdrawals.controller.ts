import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { WithdrawalsService } from './withdrawals.service';

@ApiTags('Withdrawals')
@ApiBearerAuth()
@Controller('withdrawals')
export class WithdrawalsController {
  constructor( 
    private readonly withdrawalsService: WithdrawalsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Solicitar saque',
  })
  create(
    @Req()
    request: {
      user: {
        userId: string;
        email: string;
      };
    },
    @Body()
    dto: CreateWithdrawalDto,
  ) {
    return this.withdrawalsService.create(
      request.user.userId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Consultar saque por ID',
  })
  findOne(
    @Req()
    request: {
      user: {
        userId: string;
        email: string;
      };
    },
    @Param('id')
    id: string,
  ) {
    return this.withdrawalsService.findOne(
      request.user.userId,
      id,
    );
  }
}
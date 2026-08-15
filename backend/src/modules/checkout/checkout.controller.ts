import {
    Body,
    Controller,
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

import { CheckoutService } from './checkout.service';
import { CreatePixCheckoutDto } from './dtos/create-pix-checkout.dto';
import { CreateCardCheckoutDto } from './dtos/create-card-checkout.dto';

@ApiTags('Checkout')
@ApiBearerAuth()
@Controller('checkouts')
export class CheckoutController {
    constructor(
        private readonly checkoutService: CheckoutService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('pix')
    @ApiOperation({
        summary: 'Criar checkout Pix',
    })
    createPix(
        @Req()
        request: {
            user: {
                userId: string;
                email: string;
            };
        },
        @Body()
        dto: CreatePixCheckoutDto,
    ) {
        return this.checkoutService.createPixCheckout(
            request.user.userId,
            dto,
        );
    }


    @Post('card')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Criar checkout com cartão',
    })
    createCard(
        @Req()
        request: {
            user: {
                userId: string;
                email: string;
            };
        },
        @Body()
        dto: CreateCardCheckoutDto,
    ) {
        return this.checkoutService.createCardCheckout(
            request.user.userId,
            dto,
        );
    }
}
import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @ApiOperation({
        summary: 'Cadastrar usuário e criar conta no gateway',
    })
    @ApiBody({
        type: RegisterDto,
    })
    register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Autenticar usuário no gateway',
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
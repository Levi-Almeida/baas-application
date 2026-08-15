import { GatewayService } from '../gateway/gateway.service';
import { UsersService } from '../users/users.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly gatewayService;
    private readonly usersService;
    private readonly gatewayAccountsService;
    private readonly jwtService;
    constructor(gatewayService: GatewayService, usersService: UsersService, gatewayAccountsService: GatewayAccountsService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        message: string;
        gateway: any;
    }>;
    login(data: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            document: string;
            personType: "PF" | "PJ";
            tradingName: string | undefined;
        };
    }>;
}

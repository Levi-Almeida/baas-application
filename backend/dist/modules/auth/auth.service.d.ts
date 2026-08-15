import { GatewayService } from '../gateway/gateway.service';
import { UsersService } from '../users/users.service';
import { GatewayAccountsService } from '../gateway-accounts/gateway-accounts.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
export declare class AuthService {
    private readonly gatewayService;
    private readonly usersService;
    private readonly gatewayAccountsService;
    constructor(gatewayService: GatewayService, usersService: UsersService, gatewayAccountsService: GatewayAccountsService);
    register(data: RegisterDto): Promise<{
        message: string;
        gateway: any;
    }>;
    login(data: LoginDto): Promise<{
        message: string;
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

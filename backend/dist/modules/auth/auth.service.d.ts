import { GatewayService } from '../gateway/gateway.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
export declare class AuthService {
    private readonly gatewayService;
    constructor(gatewayService: GatewayService);
    register(data: RegisterDto): Promise<{
        message: string;
        gateway: any;
    }>;
    login(data: LoginDto): Promise<any>;
}

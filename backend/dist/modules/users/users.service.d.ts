import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByDocument(document: string): Promise<User | null>;
    create(data: {
        name: string;
        email: string;
        document: string;
        personType: 'PF' | 'PJ';
        tradingName?: string;
    }): Promise<User>;
}

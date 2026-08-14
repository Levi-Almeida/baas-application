import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByDocument(document: string) {
    return this.userRepository.findOne({
      where: { document },
    });
  }

  async create(data: {
    name: string;
    email: string;
    document: string;
    personType: 'PF' | 'PJ';
    tradingName?: string;
  }) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
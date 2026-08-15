import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { RegisterGatewayUserDto } from './dtos/register-gateway-user.dto';

interface GatewayErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

@Injectable()
export class GatewayService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('GATEWAY_BASE_URL') ?? '';
  }

  async registerUser(data: RegisterGatewayUserDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/users`,
          data,
        ),
      );

      return response.data;
    } catch (error) {
      const axiosError =
        error as AxiosError<GatewayErrorResponse>;

      const status = axiosError.response?.status;

      const message =
        axiosError.response?.data?.message ??
        'Erro ao realizar cadastro no gateway';

      if (status === 409) {
        throw new ConflictException(message);
      }

      if (status) {
        throw new HttpException(message, status);
      }

      throw new BadGatewayException(
        'Não foi possível comunicar com o gateway',
      );
    }
  }

  async login(document: string, password: string) {

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/auth/login`,
          {
            document,
            password,
          },
        ),
      );
      return response.data;

    } catch (error) {
      const axiosError =
        error as AxiosError<GatewayErrorResponse>;

      const status = axiosError.response?.status;

      const message =
        axiosError.response?.data?.message ??
        'Erro ao realizar login no gateway';

      if (status === 409) {
        throw new ConflictException(message);
      }

      if (status) {
        throw new HttpException(message, status);
      }

      throw new BadGatewayException(
        'Não foi possível comunicar com o gateway',
      );
    }


  }

  async getWallet(accessToken: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/wallet`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data;
  }

  
}
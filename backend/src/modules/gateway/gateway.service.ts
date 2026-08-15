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

  async getWalletTransactions(
    accessToken: string,
    filters?: {
      status?: string;
      type?: string;
      limit?: number;
    },
  ) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/wallet/transactions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: filters,
        },
      ),
    );

    return response.data;
  }

  async getFees(
    brand?: 'VISA' | 'MASTERCARD' | 'ELO',
  ) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/fees`,
        {
          params: brand
            ? { brand }
            : undefined,
        },
      ),
    );

    return response.data;
  }

  async createPixPayment(
    accessToken: string,
    data: {
      amount: number;
      description: string;
      payerDocument: string;
      externalReference: string;
    },
  ) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/payments/pix`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data;
  }

  async createCardPayment(
    accessToken: string,
    data: {
      amount: number;
      description: string;
      externalReference: string;
      cardNumber: string;
      cardHolder: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
      installments: number;
      feePercent: number;
    },
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/payments/card`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      const axiosError =
        error as AxiosError<GatewayErrorResponse>;

      const status =
        axiosError.response?.status ?? 502;

      const message =
        axiosError.response?.data?.message ??
        'Erro ao processar pagamento com cartão';

      throw new HttpException(message, status);
    }
  }

  async createWithdrawal(
    accessToken: string,
    data: {
      amount: number;
      pixKey: string;
      description: string;
      externalReference: string;
      document: string;
    },
  ) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/withdrawals`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data;
  }

  async getWithdrawal(
    accessToken: string,
    withdrawalId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/withdrawals/${withdrawalId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data;
  }

  async getWebhooks(accessToken: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/webhooks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data;
  }

  async registerWebhook(
    accessToken: string,
    data: {
      event: 'PAYMENT_PIX' | 'PAYMENT_CARD' | 'WITHDRAWAL';
      url: string;
      secret: string;
    },
  ) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/webhooks`,
        data,
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
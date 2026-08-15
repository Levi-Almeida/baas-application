import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class RegisterWebhookDto {
  @IsIn([
    'PAYMENT_PIX',
    'PAYMENT_CARD',
    'WITHDRAWAL',
  ])
  event!:
    | 'PAYMENT_PIX'
    | 'PAYMENT_CARD'
    | 'WITHDRAWAL';

  @IsUrl({
    require_tld: false,
  })
  url!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  secret?: string;
}
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCardCheckoutDto {
  @IsInt()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsIn(['VISA', 'MASTERCARD', 'ELO'])
  brand!: 'VISA' | 'MASTERCARD' | 'ELO';

  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @IsString()
  @IsNotEmpty()
  cardHolder!: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth!: string;

  @IsString()
  @IsNotEmpty()
  expiryYear!: string;

  @IsString()
  @IsNotEmpty()
  cvv!: string;

  @IsInt()
  @Min(1)
  @Max(21)
  installments!: number;
}
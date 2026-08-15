import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePixCheckoutDto {
  @IsInt()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  payerDocument!: string;
}
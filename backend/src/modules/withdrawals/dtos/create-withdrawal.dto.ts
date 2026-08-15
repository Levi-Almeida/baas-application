import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateWithdrawalDto {
  @IsInt()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  pixKey!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  document!: string;
}
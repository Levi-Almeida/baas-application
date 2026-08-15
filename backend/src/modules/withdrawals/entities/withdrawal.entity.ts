import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({
    type: 'int',
    comment: 'Valor em centavos',
  })
  amount!: number;

  @Column({ name: 'pix_key' })
  pixKey!: string;

  @Column()
  document!: string;

  @Column()
  description!: string;

  @Column({
    name: 'external_reference',
    unique: true,
  })
  externalReference!: string;

  @Column({
    name: 'gateway_withdrawal_id',
    nullable: true,
  })
  gatewayWithdrawalId?: string;

  @Column({
    default: 'PENDING',
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
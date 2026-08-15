import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('checkout_links')
export class CheckoutLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({
    type: 'enum',
    enum: ['PIX', 'CARD'],
  })
  paymentMethod!: 'PIX' | 'CARD';

  @Column({
    type: 'int',
    comment: 'Valor em centavos',
  })
  amount!: number;

  @Column({
    name: 'external_reference',
    unique: true,
  })
  externalReference!: string;

  @Column({
    type: 'enum',
    enum: [
      'PENDING',
      'APPROVED',
      'DENIED',
      'EXPIRED',
      'CANCELLED',
    ],
    default: 'PENDING',
  })
  status!: string;

  @Column({
    name: 'gateway_payment_id',
    nullable: true,
  })
  gatewayPaymentId?: string;

  @Column({
    name: 'txid',
    nullable: true,
  })
  txid?: string;

  @Column({
    name: 'qr_code_base64',
    type: 'longtext',
    nullable: true,
  })
  qrCodeBase64?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  emv?: string;

  @Column({
    name: 'fee_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  feePercent?: number;

  @Column({
    nullable: true,
  })
  installments?: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
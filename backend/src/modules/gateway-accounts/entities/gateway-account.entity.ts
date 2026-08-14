import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('gateway_accounts')
export class GatewayAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'user_id',
    unique: true,
  })
  userId!: string;

  @OneToOne(
    () => User,
    (user) => user.gatewayAccount,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    name: 'gateway_user_id',
  })
  gatewayUserId!: string;

  @Column({
    name: 'codigo_cliente',
  })
  codigoCliente!: number;

  @Column({
    name: 'chave_loja',
  })
  chaveLoja!: string;

  @Column({
    name: 'access_token',
    type: 'text',
  })
  accessToken!: string;

  @Column({
    name: 'token_type',
    default: 'Bearer',
  })
  tokenType!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
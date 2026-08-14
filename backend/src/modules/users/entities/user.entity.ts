import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GatewayAccount } from '../../gateway-accounts/entities/gateway-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  document!: string;

  @Column({
    name: 'person_type',
    length: 2,
  })
  personType!: 'PF' | 'PJ';

  @Column({
    name: 'trading_name',
    nullable: true,
  })
  tradingName?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(
    () => GatewayAccount,
    (gatewayAccount) => gatewayAccount.user,
  )
  gatewayAccount!: GatewayAccount;
}
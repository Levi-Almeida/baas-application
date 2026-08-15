import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  event!: string;

  @Column({
    name: 'external_reference',
    nullable: true,
  })
  externalReference?: string;

  @Column({
    name: 'gateway_entity_id',
    nullable: true,
  })
  gatewayEntityId?: string;

  @Column({
    type: 'json',
  })
  payload!: Record<string, unknown>;

  @Column({
    name: 'processed_at',
    type: 'datetime',
    nullable: true,
  })
  processedAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;
}
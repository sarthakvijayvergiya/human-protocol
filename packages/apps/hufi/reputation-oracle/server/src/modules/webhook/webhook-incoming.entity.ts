import { Column, Entity } from 'typeorm';

import { NS } from '../../common/constants';
import { BaseEntity } from '../../database/base.entity';
import { WebhookStatus } from '../../common/enums';
import { ChainId } from '@human-protocol/sdk';

@Entity({ schema: NS, name: 'webhook_incoming' })
export class WebhookIncomingEntity extends BaseEntity {
  @Column({ type: 'int' })
  public chainId: ChainId;

  @Column({ type: 'varchar', nullable: true })
  public oracleAddress: string;

  @Column({ type: 'varchar' })
  public escrowAddress: string;

  @Column({ type: 'varchar', nullable: true })
  public resultsUrl: string;

  @Column({ type: 'boolean', nullable: true })
  public checkPassed: boolean;

  @Column({ type: 'int' })
  public retriesCount: number;

  @Column({ type: 'timestamptz' })
  public waitUntil: Date;

  @Column({
    type: 'enum',
    enum: WebhookStatus,
  })
  public status: WebhookStatus;
}

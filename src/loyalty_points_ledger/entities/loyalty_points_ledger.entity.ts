import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('loyalty_points_ledger')
export class LoyaltyPointsLedger {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    account_id!: string;
    @Column({ type: 'int' })
    delta_points!: number;
    @Column({ type: 'text' })
    reason!: string;
    @Column({ type: 'bigint', nullable: true })
    related_booking_id?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

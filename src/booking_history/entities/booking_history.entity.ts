import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('booking_history')
export class BookingHistory {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    booking_id!: string;
    @Column({ type: 'text' })
    action!: string;
    @Column({ type: 'text' })
    actor_type!: 'USER' | 'ADMIN' | 'SYSTEM';
    @Column({ type: 'bigint', nullable: true })
    actor_id?: string | null;
    @Column({ type: 'jsonb', nullable: true })
    details?: Record<string, unknown> | null;
    @Column({ type: 'text' })
    state!: string;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

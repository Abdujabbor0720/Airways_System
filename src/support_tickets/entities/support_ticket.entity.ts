import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('support_tickets')
export class SupportTicket {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    booking_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    assigned_admin_id?: string | null;
    @Column({ type: 'text' })
    subject!: string;
    @Column({ type: 'text', nullable: true })
    category?: 'GENERAL' | 'BOOKING' | 'REFUND' | 'TECH' | 'OTHER' | null;
    @Column({ type: 'text', default: 'OPEN' })
    status!: 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
    @Column({ type: 'text', default: 'NORMAL' })
    priority!: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

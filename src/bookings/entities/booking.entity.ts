import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('bookings')
@Unique('uq_bookings_pnr', ['pnr_code'])
export class Booking {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'text' })
    pnr_code!: string;
    @Column({ type: 'text' })
    trip_type!: 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';
    @Column({ type: 'text', default: 'PENDING' })
    status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'HOLD' | 'EXPIRED';
    @Column({ type: 'char', length: 3, default: 'USD' })
    currency_code!: string;
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    fare_total!: string;
    @Column({ type: 'text', nullable: true })
    contact_email?: string | null;
    @Column({ type: 'text', nullable: true })
    contact_phone?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

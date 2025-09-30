import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('booking_insurance')
@Unique('uq_booking_insurance', ['booking_id', 'product_id'])
export class BookingInsurance {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    booking_id!: string;
    @Column({ type: 'bigint' })
    product_id!: string;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    purchased_at!: Date;
    @Column({ type: 'text', nullable: true })
    policy_terms?: string | null;
    @Column({ type: 'timestamptz', nullable: true })
    valid_from?: Date | null;
    @Column({ type: 'timestamptz', nullable: true })
    valid_to?: Date | null;
    @Column({ type: 'text', default: 'ACTIVE' })
    status!: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('ticket_coupons')
@Unique('uq_coupons_ticket_sequence', ['ticket_id', 'sequence_no'])
@Unique('uq_coupons_ticket_instance', ['ticket_id', 'flight_instance_id'])
export class TicketsCoupon {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    ticket_id!: string;
    @Column({ type: 'bigint' })
    flight_instance_id!: string;
    @Column({ type: 'bigint', nullable: true })
    fare_class_id?: string | null;
    @Column({ type: 'text', default: 'OPEN' })
    coupon_status!: 'OPEN' | 'FLOWN' | 'VOID' | 'REFUNDED';
    @Column({ type: 'int' })
    sequence_no!: number;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

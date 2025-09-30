import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('tickets')
@Unique('uq_tickets_number', ['ticket_number'])
export class Ticket {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    booking_id!: string;
    @Column({ type: 'bigint' })
    passenger_id!: string;
    @Column({ type: 'text' })
    ticket_number!: string;
    @Column({ type: 'text', default: 'ACTIVE' })
    status!: 'ACTIVE' | 'VOIDED' | 'USED' | 'REFUNDED';
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    issued_at!: Date;
}

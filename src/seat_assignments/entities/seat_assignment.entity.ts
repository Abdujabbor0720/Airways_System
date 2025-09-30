import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('seat_assignments')
@Unique('uq_assignments_flight_seat', ['flight_instance_id', 'seat_id'])
export class SeatAssignment {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    flight_instance_id!: string;
    @Column({ type: 'bigint' })
    seat_id!: string;
    @Column({ type: 'bigint', unique: true })
    ticket_coupon_id!: string;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    assigned_at!: Date;
}

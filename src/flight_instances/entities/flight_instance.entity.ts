import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('flight_instances')
@Unique('uq_flight_instances_flight_departure', ['flight_id', 'departure_scheduled'])
export class FlightInstance {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    flight_id!: string;
    @Column({ type: 'timestamptz' })
    departure_scheduled!: Date;
    @Column({ type: 'timestamptz' })
    arrival_scheduled!: Date;
    @Column({ type: 'timestamptz', nullable: true })
    departure_actual?: Date | null;
    @Column({ type: 'timestamptz', nullable: true })
    arrival_actual?: Date | null;
    @Column({ type: 'text', default: 'SCHEDULED' })
    status!: 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
    @Column({ type: 'bigint', nullable: true })
    plane_id?: string | null;
    @Column({ type: 'text', nullable: true })
    terminal_departure?: string | null;
    @Column({ type: 'text', nullable: true })
    gate_departure?: string | null;
    @Column({ type: 'text', nullable: true })
    terminal_arrival?: string | null;
    @Column({ type: 'text', nullable: true })
    gate_arrival?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

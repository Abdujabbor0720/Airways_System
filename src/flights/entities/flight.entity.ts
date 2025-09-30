import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('flights')
@Unique('uq_flights_airline_flight_number', ['airline_id', 'flight_number'])
@Index('idx_flights_route', ['from_airport_id', 'to_airport_id'])
export class Flight {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    airline_id!: string;
    @Column({ type: 'text' })
    flight_number!: string;
    @Column({ type: 'bigint' })
    from_airport_id!: string;
    @Column({ type: 'bigint' })
    to_airport_id!: string;
    @Column({ type: 'int', nullable: true })
    scheduled_duration_minutes?: number | null;
    @Column({ type: 'boolean', default: true })
    active!: boolean;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

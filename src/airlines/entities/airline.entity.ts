import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
@Entity('airlines')
@Unique('uq_airlines_iata', ['iata_code'])
@Unique('uq_airlines_icao', ['icao_code'])
export class Airline {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'char', length: 2, nullable: true })
    iata_code?: string | null;
    @Column({ type: 'char', length: 3, nullable: true })
    icao_code?: string | null;
    @Column({ type: 'text', nullable: true })
    callsign?: string | null;
    @Column({ type: 'bigint', nullable: true })
    country_id?: string | null;
    @Column({ type: 'boolean', default: true })
    active!: boolean;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

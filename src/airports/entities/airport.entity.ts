import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Unique, } from 'typeorm';
import { City } from '../../cities/entities/city.entity';
@Entity('airports')
@Unique('uq_airports_iata', ['iata_code'])
@Unique('uq_airports_icao', ['icao_code'])
export class Airport {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    @Index('idx_airports_city')
    city_id!: string;
    @ManyToOne(() => City, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
    city!: City;
    @Column({ type: 'char', length: 3, nullable: true })
    iata_code?: string | null;
    @Column({ type: 'char', length: 4, nullable: true })
    icao_code?: string | null;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'double precision', nullable: true })
    latitude?: number | null;
    @Column({ type: 'double precision', nullable: true })
    longitude?: number | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

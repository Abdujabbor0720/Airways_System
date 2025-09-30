import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn, } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
@Entity('cities')
@Unique('uq_cities_country_name', ['country_id', 'name'])
export class City {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    @Index('idx_cities_country')
    country_id!: string;
    @ManyToOne(() => Country, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
    country!: Country;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'text', nullable: true })
    timezone?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
@Entity('countries')
@Unique('uq_countries_iso2', ['iso2'])
@Unique('uq_countries_iso3', ['iso3'])
export class Country {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'char', length: 2 })
    @Index('idx_countries_iso2')
    iso2!: string;
    @Column({ type: 'char', length: 3, nullable: true })
    iso3?: string | null;
    @Column({ type: 'text' })
    name!: string;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

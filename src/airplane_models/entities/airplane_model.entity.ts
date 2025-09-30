import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('airplane_models')
@Unique('uq_airplane_models_manufacturer_model', ['manufacturer', 'model'])
export class AirplaneModel {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    manufacturer!: string;
    @Column({ type: 'text' })
    model!: string;
    @Column({ type: 'text', nullable: true })
    icao_code?: string | null;
    @Column({ type: 'int', nullable: true })
    typical_range_km?: number | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

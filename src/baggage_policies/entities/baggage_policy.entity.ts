import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('baggage_policies')
export class BaggagePolicy {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    airline_id!: string;
    @Column({ type: 'bigint', nullable: true })
    seat_class_id?: string | null;
    @Column({ type: 'int', nullable: true })
    max_pieces?: number | null;
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    max_weight_kg?: string | null;
    @Column({ type: 'int', nullable: true })
    carry_on_pieces?: number | null;
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    carry_on_weight_kg?: string | null;
    @Column({ type: 'text', nullable: true })
    notes?: string | null;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
@Entity('planes')
@Unique('uq_planes_tail', ['tail_number'])
export class Plane {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    airline_id!: string;
    @Column({ type: 'bigint' })
    airplane_model_id!: string;
    @Column({ type: 'text' })
    tail_number!: string;
    @Column({ type: 'boolean', default: true })
    in_service!: boolean;
    @Column({ type: 'int', nullable: true })
    manufactured_year?: number | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

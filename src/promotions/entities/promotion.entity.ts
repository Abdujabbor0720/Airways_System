import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('promotions')
@Unique('uq_promotions_code', ['code'])
export class Promotion {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    code!: string;
    @Column({ type: 'text', nullable: true })
    description?: string | null;
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    discount_percent?: string | null;
    @Column({ type: 'date', nullable: true })
    valid_from?: string | null;
    @Column({ type: 'date', nullable: true })
    valid_to?: string | null;
    @Column({ type: 'boolean', default: true })
    active!: boolean;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

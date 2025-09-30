import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('corporate_contracts')
export class CorporateContract {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    company_name!: string;
    @Column({ type: 'text', nullable: true })
    contact_person?: string | null;
    @Column({ type: 'text', nullable: true })
    contact_email?: string | null;
    @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
    discount_percent?: string | null;
    @Column({ type: 'date', nullable: true })
    valid_from?: string | null;
    @Column({ type: 'date', nullable: true })
    valid_to?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

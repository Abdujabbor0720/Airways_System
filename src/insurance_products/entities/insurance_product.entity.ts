import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('insurance_products')
export class InsuranceProduct {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    provider_id!: string;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'text', nullable: true })
    coverage_details?: string | null;
    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price!: string;
    @Column({ type: 'char', length: 3, default: 'USD' })
    currency!: string;
}

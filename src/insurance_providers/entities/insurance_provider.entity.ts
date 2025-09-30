import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('insurance_providers')
export class InsuranceProvider {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'text', nullable: true })
    contact_email?: string | null;
    @Column({ type: 'text', nullable: true })
    contact_phone?: string | null;
}

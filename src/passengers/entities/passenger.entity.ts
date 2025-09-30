import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('passengers')
export class Passenger {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'text' })
    first_name!: string;
    @Column({ type: 'text' })
    last_name!: string;
    @Column({ type: 'text', nullable: true })
    gender?: 'M' | 'F' | 'X' | null;
    @Column({ type: 'date', nullable: true })
    birth_date?: string | null;
    @Column({ type: 'text', nullable: true })
    document_type?: 'PASSPORT' | 'ID' | 'BIRTH_CERT' | null;
    @Column({ type: 'text', nullable: true })
    document_number?: string | null;
    @Column({ type: 'bigint', nullable: true })
    nationality_country_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    loyalty_account_id?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

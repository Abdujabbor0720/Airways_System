import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    email!: string;
    @Column({ type: 'text' })
    password_hash!: string;
    @Column({ type: 'text', nullable: true })
    full_name?: string | null;
    @Column({ type: 'text', nullable: true })
    phone?: string | null;
    @Column({ type: 'date', nullable: true })
    birth_date?: string | null;
    @Column({ type: 'boolean', default: true })
    loyalty_opt_in!: boolean;
    @Column({ type: 'text', nullable: true, unique: true })
    referral_code?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
    @Column({ type: 'text', default: 'ACTIVE' })
    status!: 'ACTIVE' | 'BLOCKED' | 'DELETED';
}

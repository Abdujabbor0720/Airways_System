import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('admin_users')
export class AdminUser {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    email!: string;
    @Column({ type: 'text' })
    password_hash!: string;
    @Column({ type: 'text', nullable: true })
    full_name?: string | null;
    @Column({ type: 'text' })
    role!: 'ADMIN' | 'SUPER_ADMIN';
    @Column({ type: 'text', default: 'ACTIVE' })
    status!: 'ACTIVE' | 'BLOCKED' | 'DELETED';
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('auth_logins')
export class AuthLogin {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    admin_user_id?: string | null;
    @Column({ type: 'boolean' })
    success!: boolean;
    @Column({ type: 'inet', nullable: true })
    ip?: string | null;
    @Column({ type: 'text', nullable: true })
    user_agent?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

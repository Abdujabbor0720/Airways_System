import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('admin_activity_logs')
export class AdminActivityLog {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    admin_user_id?: string | null;
    @Column({ type: 'text' })
    action!: string;
    @Column({ type: 'text' })
    entity_type!: string;
    @Column({ type: 'bigint', nullable: true })
    entity_id?: string | null;
    @Column({ type: 'jsonb', nullable: true })
    details?: Record<string, unknown> | null;
    @Column({ type: 'inet', nullable: true })
    ip?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

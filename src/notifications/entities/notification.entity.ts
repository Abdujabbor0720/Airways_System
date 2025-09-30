import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    admin_user_id?: string | null;
    @Column({ type: 'text' })
    channel!: 'EMAIL' | 'SMS' | 'PUSH';
    @Column({ type: 'text' })
    purpose!: string;
    @Column({ type: 'text', nullable: true })
    to_address?: string | null;
    @Column({ type: 'text', nullable: true })
    subject?: string | null;
    @Column({ type: 'text', nullable: true })
    body?: string | null;
    @Column({ type: 'jsonb', nullable: true })
    payload?: Record<string, unknown> | null;
    @Column({ type: 'text', default: 'QUEUED' })
    status!: 'QUEUED' | 'SENT' | 'FAILED';
    @Column({ type: 'text', nullable: true })
    error_message?: string | null;
    @Column({ type: 'timestamptz', nullable: true })
    sent_at?: Date | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

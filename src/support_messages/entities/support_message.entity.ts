import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('support_messages')
export class SupportMessage {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    support_ticket_id!: string;
    @Column({ type: 'text' })
    sender_type!: 'USER' | 'ADMIN' | 'SYSTEM';
    @Column({ type: 'bigint', nullable: true })
    sender_user_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    sender_admin_id?: string | null;
    @Column({ type: 'text' })
    message!: string;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

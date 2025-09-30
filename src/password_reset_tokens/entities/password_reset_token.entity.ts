import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('password_reset_tokens')
export class PasswordResetToken {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    user_id!: string;
    @Column({ type: 'text', unique: true })
    token!: string;
    @Column({ type: 'timestamptz' })
    expires_at!: Date;
    @Column({ type: 'timestamptz', nullable: true })
    used_at?: Date | null;
}

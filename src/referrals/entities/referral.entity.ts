import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('referrals')
export class Referral {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    referrer_user_id!: string;
    @Column({ type: 'bigint', unique: true })
    referee_user_id!: string;
    @Column({ type: 'text', nullable: true })
    code_used?: string | null;
    @Column({ type: 'text', default: 'PENDING' })
    status!: 'PENDING' | 'APPROVED' | 'REJECTED';
    @Column({ type: 'int', default: 0 })
    reward_points!: number;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @Column({ type: 'timestamptz', nullable: true })
    approved_at?: Date | null;
}

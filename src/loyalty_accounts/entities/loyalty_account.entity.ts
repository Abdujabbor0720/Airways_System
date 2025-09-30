import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
@Entity('loyalty_accounts')
@Unique('uq_loyalty_accounts_user', ['user_id'])
export class LoyaltyAccount {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    user_id!: string;
    @Column({ type: 'bigint', nullable: true })
    tier_id?: string | null;
    @Column({ type: 'int', default: 0 })
    points_balance!: number;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('partner_point_transactions')
export class PartnerPointTransaction {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    partner_id!: string;
    @Column({ type: 'bigint' })
    user_id!: string;
    @Column({ type: 'int' })
    points_delta!: number;
    @Column({ type: 'text', nullable: true })
    reason?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('promotion_redemptions')
@Unique('uq_promo_redemption', ['promotion_id', 'user_id', 'booking_id'])
export class PromotionsRedemption {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    promotion_id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    booking_id?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    redeemed_at!: Date;
}

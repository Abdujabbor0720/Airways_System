import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('loyalty_tiers')
@Unique('uq_loyalty_tiers_name', ['name'])
export class LoyaltyTier {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'int', default: 0 })
    min_points!: number;
    @Column({ type: 'text', nullable: true })
    benefits?: string | null;
}

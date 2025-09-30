import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('baggage_items')
@Unique('uq_baggage_piece', ['ticket_coupon_id', 'piece_no'])
export class BaggageItem {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    ticket_coupon_id!: string;
    @Column({ type: 'int' })
    piece_no!: number;
    @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
    weight_kg?: string | null;
    @Column({ type: 'boolean', default: false })
    is_carry_on!: boolean;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('fare_classes')
@Unique('uq_fare_classes_code', ['code'])
export class FareClass {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    code!: string;
    @Column({ type: 'bigint' })
    seat_class_id!: string;
    @Column({ type: 'boolean', default: false })
    refundable!: boolean;
    @Column({ type: 'boolean', default: true })
    changeable!: boolean;
    @Column({ type: 'int', nullable: true })
    advance_purchase_days?: number | null;
    @Column({ type: 'bigint', nullable: true })
    baggage_policy_id?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

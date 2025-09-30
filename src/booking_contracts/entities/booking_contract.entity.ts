import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('booking_contracts')
@Unique('uq_booking_contract', ['booking_id', 'contract_id'])
export class BookingContract {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    booking_id!: string;
    @Column({ type: 'bigint' })
    contract_id!: string;
    @Column({ type: 'timestamptz' })
    valid_from!: Date;
    @Column({ type: 'timestamptz' })
    valid_to!: Date;
    @Column({ type: 'text' })
    terms!: string;
    @Column({ type: 'text' })
    status!: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

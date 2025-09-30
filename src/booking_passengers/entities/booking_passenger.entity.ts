import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('booking_passengers')
@Unique('uq_booking_passenger', ['booking_id', 'passenger_id'])
export class BookingPassenger {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    booking_id!: string;
    @Column({ type: 'bigint' })
    passenger_id!: string;
    @Column({ type: 'text' })
    passenger_type!: 'ADULT' | 'CHILD' | 'INFANT';
    @Column({ type: 'boolean', default: false })
    is_primary_contact!: boolean;
    @Column({ type: 'text', nullable: true })
    document_type?: 'PASSPORT' | 'ID' | 'BIRTH_CERT' | null;
    @Column({ type: 'text', nullable: true })
    document_number?: string | null;
    @Column({ type: 'text', nullable: true })
    gender?: 'M' | 'F' | 'X' | null;
    @Column({ type: 'bigint', nullable: true })
    nationality_country_id?: string | null;
}

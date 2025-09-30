import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('booking_meals')
@Unique('uq_booking_meal', ['booking_id', 'passenger_id'])
export class BookingMeal {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    booking_id!: string;
    @Column({ type: 'bigint' })
    passenger_id!: string;
    @Column({ type: 'bigint' })
    meal_option_id!: string;
    @Column({ type: 'text', nullable: true })
    special_request?: string | null;
    @Column({ type: 'text', nullable: true })
    dietary_constraint?: string | null;
}

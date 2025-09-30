import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('seat_classes')
@Unique('uq_seat_classes_code', ['code'])
export class SeatClass {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    code!: string;
    @Column({ type: 'text' })
    display_name!: string;
}

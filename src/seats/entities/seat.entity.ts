import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('seats')
@Unique('uq_seats_plane_number', ['plane_id', 'seat_number'])
export class Seat {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    plane_id!: string;
    @Column({ type: 'text' })
    seat_number!: string;
    @Column({ type: 'bigint' })
    seat_class_id!: string;
    @Column({ type: 'boolean', default: false })
    extra_legroom!: boolean;
    @Column({ type: 'boolean', nullable: true })
    is_window?: boolean | null;
    @Column({ type: 'boolean', nullable: true })
    is_aisle?: boolean | null;
    @Column({ type: 'boolean', nullable: true })
    is_exit_row?: boolean | null;
    @Column({ type: 'boolean', default: false })
    is_blocked!: boolean;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
    blocked: any;
}

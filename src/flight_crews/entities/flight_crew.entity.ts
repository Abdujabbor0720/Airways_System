import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('flight_crews')
@Unique('uq_flightcrew_instance_member', ['flight_instance_id', 'crew_member_id'])
export class FlightCrew {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    flight_instance_id!: string;
    @Column({ type: 'bigint' })
    crew_member_id!: string;
    @Column({ type: 'text' })
    duty_role!: string;
}

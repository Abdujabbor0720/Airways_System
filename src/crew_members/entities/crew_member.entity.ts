import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('crew_members')
export class CrewMember {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    full_name!: string;
    @Column({ type: 'text' })
    role!: 'PILOT' | 'COPILOT' | 'FLIGHT_ATTENDANT' | 'ENGINEER';
    @Column({ type: 'date' })
    hire_date!: string;
    @Column({ type: 'boolean', default: true })
    active!: boolean;
    @Column({ type: 'text', nullable: true })
    qualification?: string | null;
    @Column({ type: 'text', nullable: true, unique: true })
    identification_document?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

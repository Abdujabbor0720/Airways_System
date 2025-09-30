import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user_search_history')
export class UserSearchHistory {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    user_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    origin_airport_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    destination_airport_id?: string | null;
    @Column({ type: 'date' })
    depart_date!: string;
    @Column({ type: 'date', nullable: true })
    return_date?: string | null;
    @Column({ type: 'int', default: 1 })
    adults!: number;
    @Column({ type: 'int', default: 0 })
    children!: number;
    @Column({ type: 'int', default: 0 })
    infants!: number;
    @Column({ type: 'bigint', nullable: true })
    cabin_class_id?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

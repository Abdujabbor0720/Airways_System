import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint' })
    user_id!: string;
    @Column({ type: 'bigint', nullable: true })
    flight_id?: string | null;
    @Column({ type: 'bigint', nullable: true })
    airline_id?: string | null;
    @Column({ type: 'int' })
    rating!: number;
    @Column({ type: 'text', nullable: true })
    comment?: string | null;
    @Column({ type: 'text', default: 'PENDING' })
    status!: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @Column({ type: 'timestamptz', nullable: true })
    published_at?: Date | null;
}

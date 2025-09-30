import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('partners')
export class Partner {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    name!: string;
    @Column({ type: 'text' })
    type!: 'HOTEL' | 'TRANSPORT' | 'BANK' | 'OTHER';
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
}

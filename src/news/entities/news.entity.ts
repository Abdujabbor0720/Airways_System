import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
@Entity('news')
export class News {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'bigint', nullable: true })
    author_admin_id?: string | null;
    @Column({ type: 'text' })
    title!: string;
    @Column({ type: 'text', nullable: true, unique: true })
    slug?: string | null;
    @Column({ type: 'text' })
    body!: string;
    @Column({ type: 'text', default: 'DRAFT' })
    status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    @Column({ type: 'timestamptz', nullable: true })
    published_at?: Date | null;
    @Column({ type: 'text', nullable: true })
    image_url?: string | null;
    @Column({ type: 'text', nullable: true })
    image_key?: string | null;
    @Column({ type: 'text', nullable: true })
    image_content_type?: string | null;
    @Column({ type: 'bigint', nullable: true })
    image_size?: string | null;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;
}

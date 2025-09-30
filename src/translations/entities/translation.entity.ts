import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('translations')
@Unique('uq_translation_key', ['entity_type', 'entity_id', 'lang_code', 'field'])
export class Translation {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    entity_type!: string;
    @Column({ type: 'bigint' })
    entity_id!: string;
    @Column({ type: 'char', length: 2 })
    lang_code!: string;
    @Column({ type: 'text' })
    field!: string;
    @Column({ type: 'text' })
    text!: string;
}

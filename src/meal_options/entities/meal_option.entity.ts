import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Entity('meal_options')
@Unique('uq_meal_option_code', ['code'])
export class MealOption {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;
    @Column({ type: 'text' })
    code!: string;
    @Column({ type: 'text' })
    description!: string;
}

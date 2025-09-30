import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealOptionsService } from './meal_options.service';
import { MealOptionsController } from './meal_options.controller';
import { MealOption } from './entities/meal_option.entity';
@Module({
    imports: [TypeOrmModule.forFeature([MealOption])],
    controllers: [MealOptionsController],
    providers: [MealOptionsService],
})
export class MealOptionsModule {
}

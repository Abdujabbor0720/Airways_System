import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingMeal } from './entities/booking_meal.entity';
import { MealOption } from '../meal_options/entities/meal_option.entity';
import { Passenger } from '../passengers/entities/passenger.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { BookingMealsService } from './booking_meals.service';
import { BookingMealsController } from './booking_meals.controller';
@Module({
    imports: [TypeOrmModule.forFeature([BookingMeal, MealOption, Passenger, Ticket])],
    controllers: [BookingMealsController],
    providers: [BookingMealsService],
})
export class BookingMealsModule {
}

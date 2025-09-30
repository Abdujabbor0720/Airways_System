import { Test, TestingModule } from '@nestjs/testing';
import { BookingMealsController } from './booking_meals.controller';
import { BookingMealsService } from './booking_meals.service';
describe('BookingMealsController', () => {
    let controller: BookingMealsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingMealsController],
            providers: [BookingMealsService],
        }).compile();
        controller = module.get<BookingMealsController>(BookingMealsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

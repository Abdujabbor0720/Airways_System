import { Test, TestingModule } from '@nestjs/testing';
import { BookingMealsService } from './booking_meals.service';
describe('BookingMealsService', () => {
    let service: BookingMealsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookingMealsService],
        }).compile();
        service = module.get<BookingMealsService>(BookingMealsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

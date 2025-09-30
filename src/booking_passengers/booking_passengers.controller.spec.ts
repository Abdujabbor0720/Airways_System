import { Test, TestingModule } from '@nestjs/testing';
import { BookingPassengersController } from './booking_passengers.controller';
import { BookingPassengersService } from './booking_passengers.service';
describe('BookingPassengersController', () => {
    let controller: BookingPassengersController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingPassengersController],
            providers: [BookingPassengersService],
        }).compile();
        controller = module.get<BookingPassengersController>(BookingPassengersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

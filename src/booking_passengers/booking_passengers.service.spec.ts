import { Test, TestingModule } from '@nestjs/testing';
import { BookingPassengersService } from './booking_passengers.service';
describe('BookingPassengersService', () => {
    let service: BookingPassengersService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookingPassengersService],
        }).compile();
        service = module.get<BookingPassengersService>(BookingPassengersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

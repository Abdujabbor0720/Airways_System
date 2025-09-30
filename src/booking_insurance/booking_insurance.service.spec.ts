import { Test, TestingModule } from '@nestjs/testing';
import { BookingInsuranceService } from './booking_insurance.service';
describe('BookingInsuranceService', () => {
    let service: BookingInsuranceService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookingInsuranceService],
        }).compile();
        service = module.get<BookingInsuranceService>(BookingInsuranceService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

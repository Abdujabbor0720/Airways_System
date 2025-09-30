import { Test, TestingModule } from '@nestjs/testing';
import { BookingInsuranceController } from './booking_insurance.controller';
import { BookingInsuranceService } from './booking_insurance.service';
describe('BookingInsuranceController', () => {
    let controller: BookingInsuranceController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingInsuranceController],
            providers: [BookingInsuranceService],
        }).compile();
        controller = module.get<BookingInsuranceController>(BookingInsuranceController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

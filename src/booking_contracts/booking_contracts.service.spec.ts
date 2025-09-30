import { Test, TestingModule } from '@nestjs/testing';
import { BookingContractsService } from './booking_contracts.service';
describe('BookingContractsService', () => {
    let service: BookingContractsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookingContractsService],
        }).compile();
        service = module.get<BookingContractsService>(BookingContractsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BookingContractsController } from './booking_contracts.controller';
import { BookingContractsService } from './booking_contracts.service';
describe('BookingContractsController', () => {
    let controller: BookingContractsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingContractsController],
            providers: [BookingContractsService],
        }).compile();
        controller = module.get<BookingContractsController>(BookingContractsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

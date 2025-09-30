import { Test, TestingModule } from '@nestjs/testing';
import { BookingHistoryController } from './booking_history.controller';
import { BookingHistoryService } from './booking_history.service';
describe('BookingHistoryController', () => {
    let controller: BookingHistoryController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingHistoryController],
            providers: [BookingHistoryService],
        }).compile();
        controller = module.get<BookingHistoryController>(BookingHistoryController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

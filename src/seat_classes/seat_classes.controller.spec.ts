import { Test, TestingModule } from '@nestjs/testing';
import { SeatClassesController } from './seat_classes.controller';
import { SeatClassesService } from './seat_classes.service';
describe('SeatClassesController', () => {
    let controller: SeatClassesController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeatClassesController],
            providers: [SeatClassesService],
        }).compile();
        controller = module.get<SeatClassesController>(SeatClassesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

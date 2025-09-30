import { Test, TestingModule } from '@nestjs/testing';
import { SeatClassesService } from './seat_classes.service';
describe('SeatClassesService', () => {
    let service: SeatClassesService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SeatClassesService],
        }).compile();
        service = module.get<SeatClassesService>(SeatClassesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SeatAssignmentsService } from './seat_assignments.service';
describe('SeatAssignmentsService', () => {
    let service: SeatAssignmentsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SeatAssignmentsService],
        }).compile();
        service = module.get<SeatAssignmentsService>(SeatAssignmentsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

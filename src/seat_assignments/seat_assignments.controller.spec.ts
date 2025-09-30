import { Test, TestingModule } from '@nestjs/testing';
import { SeatAssignmentsController } from './seat_assignments.controller';
import { SeatAssignmentsService } from './seat_assignments.service';
describe('SeatAssignmentsController', () => {
    let controller: SeatAssignmentsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeatAssignmentsController],
            providers: [SeatAssignmentsService],
        }).compile();
        controller = module.get<SeatAssignmentsController>(SeatAssignmentsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

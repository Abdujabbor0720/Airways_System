import { Test, TestingModule } from '@nestjs/testing';
import { FlightInstancesService } from './flight_instances.service';
describe('FlightInstancesService', () => {
    let service: FlightInstancesService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FlightInstancesService],
        }).compile();
        service = module.get<FlightInstancesService>(FlightInstancesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

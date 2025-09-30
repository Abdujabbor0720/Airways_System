import { Test, TestingModule } from '@nestjs/testing';
import { FlightCrewsService } from './flight_crews.service';
describe('FlightCrewsService', () => {
    let service: FlightCrewsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FlightCrewsService],
        }).compile();
        service = module.get<FlightCrewsService>(FlightCrewsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

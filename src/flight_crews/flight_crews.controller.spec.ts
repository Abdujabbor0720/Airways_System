import { Test, TestingModule } from '@nestjs/testing';
import { FlightCrewsController } from './flight_crews.controller';
import { FlightCrewsService } from './flight_crews.service';
describe('FlightCrewsController', () => {
    let controller: FlightCrewsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FlightCrewsController],
            providers: [FlightCrewsService],
        }).compile();
        controller = module.get<FlightCrewsController>(FlightCrewsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

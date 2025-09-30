import { Test, TestingModule } from '@nestjs/testing';
import { FlightInstancesController } from './flight_instances.controller';
import { FlightInstancesService } from './flight_instances.service';
describe('FlightInstancesController', () => {
    let controller: FlightInstancesController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FlightInstancesController],
            providers: [FlightInstancesService],
        }).compile();
        controller = module.get<FlightInstancesController>(FlightInstancesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

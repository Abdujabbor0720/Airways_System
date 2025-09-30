import { Test, TestingModule } from '@nestjs/testing';
import { AirplaneModelsController } from './airplane_models.controller';
import { AirplaneModelsService } from './airplane_models.service';
describe('AirplaneModelsController', () => {
    let controller: AirplaneModelsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AirplaneModelsController],
            providers: [AirplaneModelsService],
        }).compile();
        controller = module.get<AirplaneModelsController>(AirplaneModelsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AirplaneModelsService } from './airplane_models.service';
describe('AirplaneModelsService', () => {
    let service: AirplaneModelsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AirplaneModelsService],
        }).compile();
        service = module.get<AirplaneModelsService>(AirplaneModelsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
